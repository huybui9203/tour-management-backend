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
        try {
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
        const { page } = req.query;
        try {
            const list = await db.Tour.findAll({
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
                list: list,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new TourController();
