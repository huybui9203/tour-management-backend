'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.hasMany(models.Tour, {foreignKey: 'res_id'})
    }
  }
  Restaurant.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    rating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Restaurant',
    timestamps:true,
    paranoid: true,
  });
  return Restaurant;
};