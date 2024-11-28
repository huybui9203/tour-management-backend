const db = require('../../models')
const { where, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { ROLES, VEHS } = require('../../utils/listValues');
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

                        {
                            model: db.Image,
                            as: 'images',
                            attributes: ['img_url']
                        },

                        {
                            model: db.Account,
                            as: 'liked_users',
                            attributes: ['id']
                        }
                        
                    ],
                
                    
                }
            )
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    async getTour (req, res, next) {
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
                    
                    {
                        model: db.Image,
                        as: 'images',
                        attributes: ['img_url', 'id']
                    },

                    {
                        model: db.Schedule,
                        as: 'schedules',
                    },
                    {
                        model: db.Account,
                        as: 'liked_users',
                        attributes: ['id']
                    }
                    
                ],

                
                
             })
            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async createTour(req, res, next) {
        const {name, departurePoint, destination, veh, countDay, coutNights, countGuess, price, status, description} = req.body
        const formData = {name, departure_point: departurePoint, destination, list_veh_id: VEHS.ID, veh_id: veh, total_day: `${countDay}N${coutNights}Đ`, number_of_guests: countGuess, price, status, description}
        try {
            const data = await db.Tour.create(formData);
            res.json(data)
        } catch (error) {
            next(error)
        }  
    }

    async updateTour(req, res,next) {
        const {name, departurePoint, destination, veh, countDay, coutNights, countGuess, price, status, description} = req.body
        const formData = {name, departure_point: departurePoint, destination, veh_id: veh, total_day: `${countDay}N${coutNights}Đ`, number_of_guests: countGuess, price, status, description}
        const {id} = req.params
        try {
            const data = await db.Tour.update(
                formData,
                { where: {
                    id
                } }
            )

            res.json(data)
        } catch (error) {
            next(error)
        }
        
    }

    async deleteTour(req, res,next) {
        const {id} = req.params
        try {
            const data = await db.Tour.destroy({
                where: {
                  id,
                },
              });
            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async createNewDate(req, res, next) {
        const {startDate, endDate, id, remainSeats, promo} =req.body
        try {
            const data = await db.TourDay.create({start_date:startDate, end_date:endDate, tour_id: id, remain_seats: remainSeats, promo})
            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async getTourDays(req, res, next) {
        const {id} = req.params
        try {
            const data = await db.TourDay.findAll({where: {tour_id:id}})
            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async createTourSchedule(req, res, next) {
        const {day,ten, description} =req.body
        const {id} = req.params
        try {
            const data = await db.Schedule.create({day, ten, description, tour_id: id})
            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async deleteScheduleTour(req, res,next) {
        const {id} = req.params
        try {
            const data = await db.Schedule.destroy({
                where: {
                  id,
                },
              });
            res.json({
                msg: 'remove' + id
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteTourDay(req, res,next) {
        const {id} = req.params
        try {
            const data = await db.TourDay.destroy({
                where: {
                  id,
                },
              });
            res.json({
                msg: 'remove' + id
            })
        } catch (error) {
            next(error)
        }
    }

    
}

module.exports = new AccountController()