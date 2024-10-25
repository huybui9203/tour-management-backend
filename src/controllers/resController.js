const { where, Op } = require('sequelize');
const db = require('../models')
class ResController {
    //[GET] /restaurants
    // async getAll(req, res) {
    //     try {
    //         const data = await db.Order.findAll({
    //             include: [{
    //                 model: db.ListValues,
    //                 as: 'status',
    //                 attributes: ['ele_name'],
    //                 where: {
    //                     list_id: { [Op.col]: 'Order.list_status_id' }
    //                 }
    //             }]
    //         })
    //         return res.status(200).json(data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


    async getTourDays(req, res, next) {
        try {
            const data = await db.TourDay.findAll()
            res.json(data)
        } catch (error) {
            next(error)
        }
    }


    async getAll(req, res) {
        try {
            const data = await db.Tour.findAll({
                include: [
                    {
                        model: db.ListValues,
                        as: 'type',
                        attributes: ['ele_name'],
                        where: {
                            list_id: { [Op.col]: 'Tour.list_type_id' }
                        }
                    },
                    {
                        model: db.ListValues,
                        as: 'veh',
                        attributes: ['ele_name'],
                        where: {
                            list_id: { [Op.col]: 'Tour.list_veh_id' }
                        }
                    },
                    
                ]
            })
            return res.status(200).json(data)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new ResController();