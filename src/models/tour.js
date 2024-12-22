'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
    static associate(models) {
      Tour.hasMany(models.Schedule, {foreignKey: 'tour_id', as: 'schedules'})
      Tour.hasMany(models.TourDay, {foreignKey:'tour_id', as: 'date'})
      Tour.hasMany(models.Image, {foreignKey:'tour_id', as: 'images'})

      Tour.belongsTo(models.ListValues, {foreignKey: 'list_veh_id', targetKey: 'list_id', as: 'list_veh'})
      Tour.belongsTo(models.ListValues, {foreignKey: 'veh_id', targetKey: 'ele_id', as: 'veh'})
      Tour.belongsToMany(models.Account, {through: models.CusFavorTour, foreignKey: 'tour_id', as: 'liked_users'})
    }
  }
  Tour.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    number_of_guests: DataTypes.INTEGER,
    total_day: DataTypes.STRING,
    departure_point: DataTypes.STRING,
    destination: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
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