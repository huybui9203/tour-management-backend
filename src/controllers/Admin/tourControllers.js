const db = require('../../models')
const { where, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { ROLES } = require('../../utils/listValues');
const bcryptjs = require('bcryptjs')
class AccountController {
    async getTours(req, res, next) {
        try {
            const data = await db.Tour.findAll(
                {
                    include: [
                        {
                            model: db.ListValues,
                            as: 'veh',
                            attributes: ['ele_name', 'ele_id'],
                            where: {
                                list_id: { [Op.col]: 'Tour.list_veh_id' }
                            }
                        },

                        {
                            model: db.TourDay,
                            as: 'date',
                        },
                        
                    ],
                    
                }
            )
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    async getATour (req, res, next) {
        const {id} = req.params
        try {
            const data = await db.Tour.findOne({ where: { id },
                include: [
                    {
                        model: db.ListValues,
                        as: 'veh',
                        attributes: ['ele_name', 'ele_id'],
                        where: {
                            list_id: { [Op.col]: 'Tour.list_veh_id' }
                        }
                    },

                    {
                        model: db.TourDay,
                        as: 'date',
                    },
                    
                ],
                
             })
            res.json(data)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AccountController()