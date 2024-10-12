const db = require('../../models')
const { where, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { ROLES } = require('../../utils/listValues');
const bcryptjs = require('bcryptjs')

class DashboardController {
    async getMonthlyRevenue(req, res, next) {
        try {
            const data = await db.Order.findAll(
                {
                    attributes: [
                        [db.sequelize.fn('MONTH', db.sequelize.col('pay_date')), 'monthNumber'],
                        [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('pay_date'), '%Y-%m'), 'month'],
                        [db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('total_price')), 0), 'totalRevenue']
                    ],
                   
                    where: {
                        pay_date: {
                            [Op.gte]: new Date('2024-01-01'),
                            [Op.lt]: new Date('2025-01-01')
                        }
                    },
                    group: ['month', 'monthNumber'],
                    order: [['month', 'ASC']],
                }
            )
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    async getMostBookedTours(req, res, next) {
        try {
            const data = await db.TourDay.findAll({
                include: [{
                    model: db.Order,
                    as: 'order',
                    attributes: []
                }],
                attributes: [
                    
                    'tour_id',
                    [db.sequelize.fn('COUNT', db.sequelize.col('order.id')), 'bookingCount'],
                ],
                group: ['id','tour_id']
            })
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }

    async getRevenueMonthYear(req, res,next) {
        const {m, y, type} = req.query

        if(type=='stat') {
            try {
                const data = await db.Order.findAll({
                    attributes: [
                        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'bookingCount'],
                        [db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('total_price')), 0), 'totalRevenue']
                    ],
                    where: {
                        pay_date: {
                            [Op.gte]: new Date(y,m-1,1),
                            [Op.lt]: new Date(y,m,1)
                        }
                    }
                }) 
    
                res.status(200).json(data)
            } catch (error) {
                next(error)
            }
        } else {
            try {
                const data = await db.Order.findAll({
                    attributes: [
                        [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('pay_date'), '%Y-%m-%d'), 'date'],
                        [db.sequelize.fn('COALESCE', db.sequelize.fn('SUM', db.sequelize.col('total_price')), 0), 'totalRevenue']
                    ],
                    where: {
                        pay_date: {
                            [Op.gte]: new Date(y,m-1,1),
                            [Op.lt]: new Date(y,m,1)
                        }
                    },
                    group: ['date'],
                    order: [['date', 'ASC']],
                }) 
    
                res.status(200).json(data)
            } catch (error) {
                next(error)
            }
        }

        
    }
}

module.exports = new DashboardController()