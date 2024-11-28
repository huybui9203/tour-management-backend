const { where, Sequelize, Op } = require("sequelize");
const db = require("../models");
const dotenv = require("dotenv");
const querystring = require("qs");
const crypto = require("crypto");
const { STATUS_ORDER } = require("../utils/listValues");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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
        const { name, email, address, phone, adult_quantity, child_quantity, adults, childs, total_price, rooms_count, tourDayId, note } =
            req.body;

        const transaction = await db.sequelize.transaction();
        const { idTour } = req.params;
        // console.log(req.body);

        try {
            const tourDay = await db.TourDay.findOne({
                where: {
                    id: tourDayId,
                },
            });

            const tour = await db.Tour.findOne({
                where: {
                    id: idTour,
                },
            });


            
            if (adult_quantity + child_quantity > tourDay.remain_seats) {
                res.status(400).json({
                    message: "Exceed the number of people",
                });
                return;
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

            const newOrder = await db.Order.create(
                {
                    total_price: total_price,
                    order_date: Date.now(),
                    number_of_people: adult_quantity + child_quantity,
                    rooms_count: rooms_count,
                    tour_day_id: tourDayId,
                    cust_id: existCustomer.id,
                    list_status_id: STATUS_ORDER.ID,
                    status_id: STATUS_ORDER.PENDING,
                    note
                },
                { transaction: transaction }
            );

            const registants = [...adults, ...childs].map((registant) => ({
                name: registant.name,
                sex: registant.sex,
                date_of_birth: new Date(registant.birthday),
                price_for_one: registant.price,
                order_id: newOrder.id,
            }));

            await db.Participant.bulkCreate(registants, { transaction: transaction });

            await db.TourDay.update({
                remain_seats: tourDay.remain_seats - (adult_quantity + child_quantity),
            }, {
                where: {
                  id: tourDayId,
                },
                transaction: transaction
              },);

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

            res.json({ 
                code: '00',
                paymentUrl: vnpUrl
             });
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
            if(vnp_Params.vnp_ResponseCode == 24 || vnp_Params.vnp_ResponseCode !== '00') {
                return res.redirect(`http://localhost:3000/payment-failed/${id}`) 
            }
            try {
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
    
                await db.Payment.create({
                    orderId: id,
                    payment_type: 'VNPAY',
                    transactionId: vnp_Params.vnp_TxnRef,
                    transactionDate: vnp_Params.vnp_PayDate,
                    bank_code: vnp_Params.vnp_BankCode
                })  
                
                res.redirect(`http://localhost:3000/payment-success`) 
            } catch (error) {
                next(error)
            }

        } else {
            res.status(200).json({
                message: "Lỗi thanh toán",
            });
        }
    }

    async vnpayRefund(req, res, next) {
    
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();

    let crypto = require("crypto");
   
    let vnp_TmnCode = process.env.TmnCode
    let secretKey = process.env.VNPAY_SECRET_KEY
    let vnp_Api = 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction'
    
    let vnp_TxnRef = req.body.transactionId;
    let vnp_TransactionDate = req.body.transactionDate;
    let vnp_Amount = req.body.amount *100;
    let vnp_TransactionType = req.body.vnp_TransactionType || '02';
    let vnp_CreateBy = req.body.vnp_CreateBy || 'abc';
            
    const now = new Date();
    let currCode = 'VND';
    const formatDate=(date) => {
        now.setMinutes(now.getMinutes()); // Thêm 15 phút vào thời gian hiện tại
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return year + month + day + hours + minutes + seconds;
    }
    
    let vnp_RequestId = Math.random().toString(36).slice(-32)
    let vnp_Version = '2.1.0';
    let vnp_Command = 'refund';
    let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;
            
    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    
    let vnp_CreateDate = formatDate(date);
    
    let vnp_TransactionNo = '0';
    
    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(new Buffer.from(data, 'utf-8')).digest("hex");
    
     let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TransactionType': vnp_TransactionType,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_Amount': vnp_Amount,
        'vnp_TransactionNo': vnp_TransactionNo,
        'vnp_CreateBy': vnp_CreateBy,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': vnp_IpAddr,
        'vnp_SecureHash': vnp_SecureHash
    };

        try {
            const result = await fetch(vnp_Api, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataObj)
            })
    
            const body = await result.text();
    
            res.json(JSON.parse(body));
        } catch (error) {
            console.log(error)
            next(error)
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
                            list_id: { [Op.col]: 'Order.list_status_id' }
                          
                        },
                        attributes: ["ele_name"],
                        as: "status",
                    },
                    {
                        model: db.TourDay,
                        as: "tour_day",
                        include: {
                            model: db.Tour,
                            as: "tour",
                        },
                    },
                    {
                        model: db.Payment,
                        as: 'payment',
                        attributes: ['transactionId', 'transactionDate', 'payment_type', 'bank_code'],
                        paranoid: false
                    }, 
                    {
                        model: db.Participant,
                        as: 'participants',
                        paranoid: false
                    }
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

    async cancelBooking(req, res,next) {
        const {id} = req.params
        try {
            const order = await db.Order.findOne({where: {id}})
            const currentRegister = order.number_of_people
            const tour = await db.TourDay.findOne({where: {id: order.tour_day_id}})
            await db.TourDay.update({remain_seats: tour.remain_seats + currentRegister}, {where: {id: order.tour_day_id}})
            const result1 = await db.Order.update( { status_id: STATUS_ORDER.CANCELED },
                {
                  where: {
                    id,
                  },
                },);
            
            const result2 = await db.Payment.destroy({
                where: {
                  orderId: id,
                },
              });
              await db.Participant.destroy({where: {order_id: id}})
              res.json([result1, result2])
        } catch (error) {
            next(error)
        }
    }



    async destroyBooking(req, res, next) {
        const {id} = req.params
        try {
            const order = await db.Order.findOne({where: {id}})
            const currentRegister = order.number_of_people
            const tour = await db.TourDay.findOne({where: {id: order.tour_day_id}})
            
            await db.Participant.destroy({where: {order_id: id}})

            
            await db.TourDay.update({remain_seats: tour.remain_seats + currentRegister}, {where: {id: order.tour_day_id}})
            await db.Order.destroy({
                where: {
                    id
                }
            })
            res.json({
                msg: 'This resource is automatically destroyed successfully because of timeout'
            })
        } catch (error) {
            next(error)
        }
    }



}

module.exports = new OrderController();
