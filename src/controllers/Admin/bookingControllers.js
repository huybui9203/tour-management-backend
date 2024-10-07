const db = require('../../models')
const { where, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { ROLES } = require('../../utils/listValues');

class BookingController {
    async getBookingCustomer(req, res, next) {
        try {
            const data = await db.Order.findAll({
                include: [
                    {
                        model: db.Customer,
                        as: 'customer',
                    },

                    {
                        model: db.TourDay,
                        as: 'tour_day',
                        include: 'tour'
                    },

                    {
                        model: db.ListValues,
                        as: 'status',
                        attributes: ['ele_name', 'ele_id'],
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
            const data = await db.Order.update(
                { status_id: statusId },
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
}

module.exports = new BookingController()