"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    static associate(models) {
      Hotel.hasMany(models.Tour, {foreignKey: 'hotel_id'})
    }
  }
  Hotel.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    rating: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Hotel',
    timestamps:true,
    paranoid: true,
  });
  return Hotel;
};
