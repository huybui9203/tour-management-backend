'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourDay extends Model {
    static associate(models) {
      TourDay.belongsTo(models.Tour, {foreignKey: 'tour_id', targetKey:'id', as: 'tour'})
      TourDay.hasMany(models.Order, {foreignKey: 'tour_day_id', as: 'order'})
    }
  }
  TourDay.init({
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    tour_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'TourDay',
    timestamps:true,
    paranoid: true,
  });
  return TourDay;
};