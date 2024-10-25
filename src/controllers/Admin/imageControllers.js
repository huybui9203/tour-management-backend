const db = require('../../models')
const { where, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { ROLES, VEHS } = require('../../utils/listValues');
const bcryptjs = require('bcryptjs')
class ImageController {
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

                    {
                        model: db.Image,
                        as: 'images',
                        attributes: ['img_url']
                    },
                    
                ],
                
             })
            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async createTourImage(req, res, next) {
        const {imgURL} = req.body
        const {id} = req.params
        try {
            const data = await db.Image.create({img_url: imgURL, tour_id: id});
            res.json(data)
        } catch (error) {
            next(error)
        }  
    }

    async updateTour(req, res,next) {
        const {name, departurePoint, destination, veh, countDay, coutNights, countGuess, adultsPrice, childrenPrice, promo, status, description, imgURL} = req.body
        const formData = {name, departure_point: departurePoint, destination, veh_id: veh, total_day: `${countDay}N${coutNights}Đ`, number_of_guests: countGuess, price: adultsPrice, promo, status, description, img_url: imgURL}
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

    async deleteTourImage(req, res,next) {
        const {id} = req.params
        try {
            const data = await db.Image.destroy({
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
        const {startDate, endDate, id} =req.body
        try {
            const data = await db.TourDay.create({start_date:startDate, end_date:endDate, tour_id: id})
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
}

module.exports = new ImageController()