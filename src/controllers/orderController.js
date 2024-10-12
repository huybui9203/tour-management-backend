const { where, Sequelize } = require("sequelize");
const db = require("../models");
const dotenv = require("dotenv");
const { STATUS_ORDER } = require("../utils/listValues");
dotenv.config();

class OrderController {
    async createNewOrder(req, res) {
        const { name, email, address, phone, adult_quantity, child_quantity, adults, childs, deposit } = req.body;
        const { idTour } = req.params;
        const transaction = await db.sequelize.transaction();
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

            const total_price = [...adults, ...childs].reduce((acc, curr) => {
                return (acc += curr.price);
            }, 0);

            const room_count = adults.reduce((acc, curr) => {
                return curr.isBookingSingleRoom && acc + 1;
            }, 0);

            const newOrder = await db.Order.create(
                {
                    total_price: total_price,
                    deposit: deposit,
                    order_date: Date.now(),
                    number_of_people: adult_quantity + child_quantity,
                    children_count: adult_quantity,
                    adults_count: child_quantity,
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
                date_of_birth: registant.birthday,
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
            });
        } catch (error) {
            await transaction.rollback();
            console.log(error);
        }
    }

    async scheduleCancelOrder(req, res) {}

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
