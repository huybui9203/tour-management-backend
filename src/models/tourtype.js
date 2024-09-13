'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourType extends Model {
    static associate(models) {
      TourType.hasMany(models.Tour, {foreignKey: 'id'})
    }
  }
  TourType.init({
    tour_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TourType',
    timestamps: false
  });
  return TourType;
};