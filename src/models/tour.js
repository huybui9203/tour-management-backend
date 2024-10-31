'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
    static associate(models) {
      Tour.belongsToMany(models.Place, {through: models.PlaceTour, foreignKey: 'tour_id', as: 'places'})
      Tour.hasMany(models.Schedule, {foreignKey: 'tour_id', as: 'schedules'})
      Tour.hasMany(models.TourDay, {foreignKey:'tour_id', as: 'date'})
      Tour.hasMany(models.Image, {foreignKey:'tour_id', as: 'images'})
      Tour.belongsTo(models.Hotel, {foreignKey: 'hotel_id', targetKey: 'id', as: 'hotel'})
      Tour.belongsTo(models.Restaurant, {foreignKey: 'res_id', targetKey: 'id', as: 'restaurant'})

      Tour.belongsTo(models.ListValues, {foreignKey: 'list_type_id', targetKey: 'list_id', as: 'list_types'})
      Tour.belongsTo(models.ListValues, {foreignKey: 'type_id', targetKey: 'ele_id', as: 'type'})
      Tour.belongsTo(models.ListValues, {foreignKey: 'list_veh_id', targetKey: 'list_id', as: 'list_veh'})
      Tour.belongsTo(models.ListValues, {foreignKey: 'veh_id', targetKey: 'ele_id', as: 'veh'})
    }
  }
  Tour.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    promo: DataTypes.FLOAT,
    number_of_guests: DataTypes.INTEGER,
    total_day: DataTypes.STRING,
    departure_point: DataTypes.STRING,
    destination: DataTypes.STRING,
    img_url: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    status: DataTypes.BOOLEAN,
    res_id: DataTypes.INTEGER,
    hotel_id: DataTypes.INTEGER,
    list_type_id: DataTypes.INTEGER,
    type_id: DataTypes.INTEGER,
    list_veh_id: DataTypes.INTEGER,
    veh_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tour',
    timestamps: true,
    paranoid: true,
  });
  return Tour;
};