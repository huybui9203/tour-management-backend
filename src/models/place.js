'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Place extends Model {
    static associate(models) {
      Place.belongsToMany(models.Tour, { through: models.PlaceTour, foreignKey: 'place_id', as: 'tours'})
    }
  }
  Place.init({
    name: DataTypes.STRING,
    city: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Place',
    timestamps:true
  });
  return Place;
};