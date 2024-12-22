const { where, Op, Sequelize } = require("sequelize");
const db = require("../models");
const dotenv = require("dotenv");
const { raw } = require("mysql2");
const { query } = require("express");
dotenv.config();

class TourController {
    // Get details tour
    async getDetailsTour(req, res) {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                message: "Incompleted data",
            });
            return;
        }
        try {
            const tour = await db.Tour.findOne({
                where: {
                    id: id,
                },
                include: [
                   
                    {
                        model: db.Schedule,
                        as: 'schedules'
                    },
                    {
                        model: db.TourDay,
                        as: "date",
                    },
                    
                    {
                        model: db.Image,
                        as: "images",
                    },
                    
                    { model: db.ListValues, as: "list_veh" },
                ],
            });

            const listTourRelated = await db.Tour.findAll({
                where: {
                    id: {
                        [Op.ne]: tour.id,
                    },
                },
                order: Sequelize.literal("RAND()"),
                limit: 2,
            });

            if (!tour) {
                res.status(400).json({
                    message: "Not found tour",
                });
                return;
            }

            res.status(200).json({
                tour: tour,
                listTourRelated: listTourRelated,
            });
        } catch (error) {
            // custom here
            console.log(error);
        }
    }
    async filterTourByType(req, res) {
        const { type } = req.params;
        if (!type) {
            res.status(400).json({
                message: "Incompleted data",
            });
            return;
        }

        try {
            const listTours = await db.Tour.findAll({
                where: {
                    type_id: type,
                },
                include: {
                    model: db.ListValues,
                    attributes: ["ele_name"],
                    where: {
                        list_id: db.Sequelize.col("Tour.list_veh_id"),
                        ele_id: db.Sequelize.col("Tour.veh_id"),
                    },
                    as: "veh",
                },
            });

            if (!listTours) {
                res.status(400).json({
                    message: "Not found list tour",
                });
                return;
            }

            res.status(200).json({
                list: listTours,
            });
        } catch (error) {
            console.log(error);
        }
    }
    async filterTourByField(req, res) {
        const { keyword, destination, duration } = req.query;
        let conditionFilter = {};
        if (keyword) {
            conditionFilter = {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${keyword}%`,
                        },
                    },
                    {
                        destination: {
                            [Op.like]: `%${keyword}%`,
                        },
                    },
                ],
            };
        }
        if (duration) {
            conditionFilter.total_day = {
                [Op.lte]: duration,
            };
        }
        if (destination) {
            conditionFilter.destination = {
                [Op.like]: `%${destination}%`,
            };
        }

        try {
            const listTours = await db.Tour.findAll({
                where: conditionFilter,
                include: [
                    {
                        model: db.Place,
                        as: "places",
                    },
                    {
                        model: db.Schedule,
                        as: 'schedules'
                    },
                    {
                        model: db.TourDay,
                        as: "date",
                    },
                    {
                        model: db.Hotel,
                        as: "hotel",
                    },
                    {
                        model: db.Restaurant,
                        as: "restaurant",
                    },
                    { model: db.ListValues, as: "list_types" },
                    { model: db.ListValues, as: "list_veh" },
                ],
            });

            res.status(200).json({
                list: listTours,
            });
        } catch (error) {
            console.log(error);
        }
    }
    async getListTour(req, res) {
        const currUserId = req?.user
        const { page } = req.query;
        try {
            const list = await db.Tour.findAll({
                include: [
                   
                    {
                        model: db.Schedule,
                        as: 'schedules'
                    },
                    {
                        model: db.TourDay,
                        as: "date",
                    },
                
                    {
                        model: db.Image,
                        as: "images",
                    },
                    {
                        model: db.Account,
                        as: 'liked_users',
                        attributes: ['id']
                    },
                    {
                        model: db.ListValues,
                        as: 'veh',
                        attributes: ['ele_name', 'ele_id'],
                        where: {
                            list_id: { [Op.col]: 'Tour.list_veh_id' }
                        }
                    },
                ],

                where: {
                    status: 1
                },
                
            });

            res.status(200).json({
                list: list,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async likeTour(req, res, next) {
        const {id} = req.params
        const userId = req?.user
        try {
            await db.CusFavorTour.create({
                cust_id:userId,
                tour_id: id,
            })
            res.json({
                msg: 'liked'
            })
        } catch (error) {
            next(error)
        }
    }
    async unLikeTour(req, res, next) {
        const {id} = req.params
        const userId = req?.user
        try {
            await db.CusFavorTour.destroy({
                where: {
                    tour_id: id,
                    cust_id: userId,
                }
            })
            res.json({
                msg: 'unLiked'
            })
        } catch (error) {
            next(error)
        }
    }

    async getNewTours(req, res, next) {
        try {
            const data = await db.Tour.findAll({
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
                where: {
                    status: 1
                },
                order: [['createdAt', 'DESC']], 
                limit: 6
            })

            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    async getDiscountingTours(req, res, next) {
        try {
            const data = await db.Tour.findAll({
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
                    },
                    {
                        model: db.TourDay,
                        as: 'date',
                        where: {
                            promo: {
                                [Op.gt] : 0
                            }
                        }
                    },
                ],
                where: {
                    status: 1
                },
            })
            res.json(data)
        } catch (error) {
            next(error)
        }
    }


    async getFavoriteTours(req, res, next) {
        try {
            const data = await db.Account.findOne({
                where: {
                    id: req?.user
                },
                include: [
                    {model: db.Tour, 
                        as: 'favor_tours', 
                        where: {status: 1},
                        include: [
                            {
                                model: db.ListValues,
                                as: 'veh',
                                attributes: ['ele_name', 'ele_id'],
                                where: {
                                    list_id: { [Op.col]: 'favor_tours.list_veh_id' }
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
                        ]
                    },
                ]
            })
            res.json(data)
        } catch (error) {
            next(error)
        }
    }


}

module.exports = new TourController();
