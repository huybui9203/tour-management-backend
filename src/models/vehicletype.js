'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VehicleType extends Model {
    static associate(models) {
      VehicleType.hasMany(models.Tour, {foreignKey: 'id'})
    }
  }
  VehicleType.init({
    vehicle_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'VehicleType',
    timestamps: false,
  });
  return VehicleType;
};