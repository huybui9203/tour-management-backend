'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
    static associate(models) {
      Tour.hasOne(models.Schedule, {foreignKey: 'id'})
      Tour.belongsToMany(models.Place, {through: models.PlaceTour, foreignKey: 'tour_id', as: 'places'})
      Tour.belongsToMany(models.Customer, {through: models.CusFavorTour, foreignKey: 'tour_id', as: 'customers'})
      Tour.hasMany(models.Order, {foreignKey: 'id'})
      Tour.belongsTo(models.Hotel, {foreignKey: 'hotel_id', targetKey: 'id', as: 'hotel'})
      Tour.belongsTo(models.Restaurant, {foreignKey: 'res_id', targetKey: 'id', as: 'restaurant'})
      Tour.belongsTo(models.VehicleType, {foreignKey: 'veh_id', targetKey: 'id', as: 'vehicle'})
      Tour.belongsTo(models.TourType, {foreignKey: 'tour_type', targetKey:'id', as: 'tour'})

    }
  }
  Tour.init({
    order_num: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    promo: DataTypes.FLOAT,
    number_of_guests: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    departure_point: DataTypes.STRING,
    img_url: DataTypes.STRING,
    destination: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    tour_type: DataTypes.INTEGER,
    res_id: DataTypes.INTEGER,
    hotel_id: DataTypes.INTEGER,
    veh_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Tour',
  });
  return Tour;
};