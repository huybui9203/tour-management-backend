const { where, Op, Sequelize } = require("sequelize");
const db = require("../models");
const dotenv = require("dotenv");
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
        const tour = await db.Tour.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: db.Place,
                    as: "places",
                },
                {
                    model: db.Schedule,
                },
                {
                    model: db.TourDay,
                },
                {
                    model: db.Hotel,
                    as: "hotel",
                },
                {
                    model: db.Restaurant,
                    as: "restaurant",
                },
                {
                    model: db.ListValues,
                    as: "list_types",
                },
                {
                    model: db.ListValues,
                    as: "type",
                },
                {
                    model: db.ListValues,
                    as: "list_veh",
                },
                {
                    model: db.ListValues,
                    as: "veh",
                },
            ],
        });

        const listTourRelated = await db.Tour.findAll({
            where: {
                id: {
                    [Op.ne]: tour.id,
                },
                type_id: {
                    [Op.eq]: tour.type_id,
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
    }
    async filterTourByType(req, res) {
        const { type } = req.params;
        if (!type) {
            res.status(400).json({
                message: "Incompleted data",
            });
            return;
        }

        const listTours = await db.Tour.findAll({
            where: {
                type_id: type,
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
        const listTours = await db.Tour.findAll({
            where: conditionFilter,
        });

        res.status(200).json({
            listTours: listTours,
        });
    }
}

module.exports = new TourController();
