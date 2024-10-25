const { where, Sequelize } = require("sequelize");
const db = require("../models");
const dotenv = require("dotenv");
const querystring = require("qs");
const crypto = require("crypto");
const { STATUS_ORDER } = require("../utils/listValues");
dotenv.config();

const config = {
    appid: "553",
    key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
    key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
    endpoint: "https://sbgateway.zalopay.vn/api/getlistmerchantbanks",
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
class OrderController {
    async createNewOrder(req, res) {
        const { name, email, address, phone, adult_quantity, child_quantity, adults, childs, deposit, total_price } =
            req.body;
        const transaction = await db.sequelize.transaction();
        const { idTour } = req.params;
        console.log(req.body);

        try {
            const tourDay = await db.TourDay.findOne({
                where: {
                    id: idTour,
                },
            });

            const tour = await db.Tour.findOne({
                where: {
                    id: tourDay.tour_id,
                },
            });

            if (tour.updateAt >= Date.now()) {
                if (adult_quantity + child_quantity > tour.number_of_guests) {
                    res.status(400).json({
                        message: "Exceed the number of people",
                    });
                    return;
                }
            }

            let existCustomer = await db.Customer.findOne({
                where: {
                    acc_id: req.user,
                },
            });

            if (!existCustomer) {
                existCustomer = await db.Customer.create(
                    { name: name, email: email, address: address, phone_number: phone, acc_id: req.user },
                    { transaction: transaction }
                );
            } else {
                await existCustomer.update(
                    {
                        name: name,
                        email: email,
                        address: address,
                        phone_number: phone,
                    },
                    { transaction: transaction }
                );
                await existCustomer.save();
            }

            const room_count = adults.reduce((acc, curr) => {
                return curr.isBookingSingleRoom && acc + 1;
            }, 0);

            const newOrder = await db.Order.create(
                {
                    total_price: total_price,
                    deposit: deposit,
                    order_date: Date.now(),
                    number_of_people: adult_quantity + child_quantity,
                    children_count: child_quantity,
                    adults_count: adult_quantity,
                    room_count: room_count,
                    tour_day_id: idTour,
                    cust_id: existCustomer.id,
                    list_status_id: STATUS_ORDER.ID,
                    status_id: STATUS_ORDER.PENDING,
                },
                { transaction: transaction }
            );

            const registants = [...adults, ...childs].map((registant) => ({
                name: registant.name,
                sex: registant.sex === "MALE" ? true : false,
                date_of_birth: new Date(registant.birthday),
                price_for_one: registant.price,
                order_id: newOrder.id,
            }));

            await db.Participant.bulkCreate(registants, { transaction: transaction });

            await tour.update({
                number_of_guests: tour.number_of_guests - (adult_quantity + child_quantity),
            });
            await tour.save();

            await transaction.commit();
            res.status(200).json({
                message: "Create new order successfully!!!",
                idOrder: newOrder.id,
            });
        } catch (error) {
            await transaction.rollback();
            console.log(error);
        }
    }

    async paymentWithVNPay(req, res) {
        try {
            var ipAddr =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            var date = new Date();
            const dateFormat = (await import("dateformat")).default;

            const now = new Date();
            now.setMinutes(now.getMinutes()); // Thêm 15 phút vào thời gian hiện tại
            const year = now.getFullYear().toString();
            const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
            const day = now.getDate().toString().padStart(2, "0");
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const seconds = now.getSeconds().toString().padStart(2, "0");
            let createDate = year + month + day + hours + minutes + seconds;

            var orderId = dateFormat(date, "HHmmss");
            var amount = req.body.amount;
            var orderType = "vnpay";
            var orderInfo = req.body.orderDescription;
            var vnp_Params = {};
            vnp_Params["vnp_Version"] = "2.1.0";
            vnp_Params["vnp_Command"] = "pay";
            vnp_Params["vnp_TmnCode"] = process.env.TmnCode;
            vnp_Params["vnp_Locale"] = "vn";
            vnp_Params["vnp_CurrCode"] = "VND";
            vnp_Params["vnp_TxnRef"] = orderId;
            vnp_Params["vnp_OrderInfo"] = orderInfo;
            vnp_Params["vnp_OrderType"] = orderType;
            vnp_Params["vnp_Amount"] = parseInt(amount) * 100;
            vnp_Params["vnp_ReturnUrl"] = `${process.env.RETURN_URL}/${req.body.idOrder}`;
            vnp_Params["vnp_IpAddr"] = ipAddr;
            vnp_Params["vnp_CreateDate"] = createDate;
            vnp_Params = sortObject(vnp_Params);

            var signData = querystring.stringify(vnp_Params, { encode: false });

            var hmac = crypto.createHmac("sha512", process.env.VNPAY_SECRET_KEY);
            var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

            vnp_Params["vnp_SecureHash"] = signed;
            const vnpUrl = process.env.VNP_URL + "?" + querystring.stringify(vnp_Params, { encode: false });

            res.json({ paymentUrl: vnpUrl });
        } catch (error) {
            console.log(error);
        }
    }

    async returnVnPay(req, res) {
        var vnp_Params = req.query;
        const { id } = req.params;
        var secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = sortObject(vnp_Params);

        var tmnCode = process.env.TmnCode;
        var secretKey = process.env.VNPAY_SECRET_KEY;

        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            const order = await db.Order.findOne({
                where: {
                    id: id,
                },
            });
            await order.update({
                list_status_id: STATUS_ORDER.ID,
                status_id: STATUS_ORDER.COMPLETED,
                pay_date: new Date(),
            });
            await order.save();
            console.log(order);

            res.redirect("http://localhost:3000/payment-success");
        } else {
            res.status(200).json({
                message: "Lỗi thanh toán",
            });
        }
    }

    async scheduleCancelOrder(idOrder) {
        const order = await db.Order.findOne({
            where: {
                id: idOrder,
            },
        });

        await order.update({
            list_status_id: STATUS_ORDER.ID,
            status_id: STATUS_ORDER.CANCELED,
        });
        await order.save();
    }

    async getHistory(req, res) {
        const idAccount = req.user;

        if (!idAccount) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }
        try {
            const customer = await db.Customer.findOne({
                where: {
                    acc_id: idAccount,
                },
            });

            if (!customer) {
                res.status(401).json({
                    message: "Not Found Customer",
                });
                return;
            }
            const orders = await db.Order.findAll({
                where: {
                    cust_id: customer.id,
                },
                include: [
                    {
                        model: db.Employee,
                        as: "employee",
                    },
                    {
                        model: db.Customer,
                        as: "customer",
                    },
                    {
                        model: db.ListValues,
                        where: {
                            list_id: db.Sequelize.col("Order.list_status_id"),
                            ele_id: db.Sequelize.col("Order.status_id"),
                        },
                        attributes: ["ele_name"],
                        as: "list_status",
                    },
                    {
                        model: db.TourDay,
                        as: "tour_day",
                        include: {
                            model: db.Tour,
                            as: "tour",
                        },
                    },
                ],
                distinct: true,
            });

            res.status(200).json({
                list: orders,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new OrderController();
