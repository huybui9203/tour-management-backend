'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlaceTour extends Model {
    static associate(models) {
      // define association here
    }
  }
  PlaceTour.init({
    tour_id: DataTypes.INTEGER,
    place_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PlaceTour',
    timestamps: false,
  });
  return PlaceTour;
};