const db = require('../../models')
const { where, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { ROLES, STATUS_ORDER } = require('../../utils/listValues');

class BookingController {
    async getBookingCustomer(req, res, next) {
        try {
            const data = await db.Order.findAll({
                include: [
                    {
                        model: db.Customer,
                        as: 'customer',
                        required: true
                    },

                    {
                        model: db.TourDay,
                        as: 'tour_day',
                        include: [{model: db.Tour, as: 'tour', required: true}],
                        required: true
                    },

                    {
                        model: db.ListValues,
                        as: 'status',
                        attributes: ['ele_name', 'ele_id'],
                        required: true,
                        where: {
                            list_id: { [Op.col]: 'Order.list_status_id' }
                        }
                    },
                    
                ]
            })
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    async updateBooking(req, res,next) {
        const {orderId, statusId} = req.body
        try {
            const dataUpdate = statusId == STATUS_ORDER.COMPLETED ? {status_id: statusId, pay_date: new Date()} : {status_id: statusId}
            const data = await db.Order.update(
                dataUpdate,
                { where: {
                    id: orderId
                } }
            )

            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async deleteBooking(req, res,next) {
        const {id} = req.params
        try {
            const data = await db.Order.destroy({
                where: {
                  id,
                },
              });
            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async getABooking (req, res, next) {
        const {id} = req.params
        try {
            const data = await db.Order.findOne({ where: { id },
                include: [
                    {
                        model: db.Customer,
                        as: 'customer',
                        required: true
                    },

                    {
                        model: db.TourDay,
                        as: 'tour_day',
                        include: [{model: db.Tour, as: 'tour', required: true}],
                        required: true
                    },

                    {
                        model: db.ListValues,
                        as: 'status',
                        attributes: ['ele_name', 'ele_id'],
                        required: true,
                        where: {
                            list_id: { [Op.col]: 'Order.list_status_id' }
                        }
                    },
                    
                ]
             })
            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async createBooking(req, res, next) {
        const {id, roomCount, customer, participants, note} = req.body
        const transaction = await db.sequelize.transaction();
        try {
            const priceForSingleRoom = 1500000
            let totalPrice = participants.reduce((acc, curr) => {
                return acc + curr.price
            }, 0)
            totalPrice += roomCount * priceForSingleRoom
            const custData = await db.Customer.create({name: customer.name,phone_number:customer.phone, address:customer.address , email: customer.email}, { transaction: transaction })
            const order = await db.Order.create({total_price:totalPrice , order_date: new Date(), pay_date: new Date(), number_of_people: participants.length, rooms_count: roomCount, cust_id: custData.id, tour_day_id: id, list_status_id: 1, status_id: 1, note}, { transaction: transaction })
            const participantData = participants.map(item => {
                return {
                    name: item.name,
                    sex: item.sex,
                    date_of_birth: item.birthday,
                    price_for_one: item.price,
                    order_id: order.id
                }
            })
            await db.Participant.bulkCreate(participantData, { transaction: transaction })
            await transaction.commit();
            res.json({
                msg: 'success'
            })
        } catch (error) {
            await transaction.rollback();
            next(error)
        }
    }
}

module.exports = new BookingController()