'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListValues extends Model {
    static associate(models) {
      ListValues.hasMany(models.Tour, {foreignKey: 'list_veh_id'})
      ListValues.hasMany(models.Tour, {foreignKey: 'veh_id'})

      ListValues.hasMany(models.Order, {foreignKey: 'list_status_id'})
      ListValues.hasMany(models.Order, {foreignKey: 'status_id'})
      
      ListValues.hasMany(models.Account, {foreignKey: 'list_role_id'})
      ListValues.hasMany(models.Account, {foreignKey: 'role_id'})
    }
  }
  ListValues.init({
    list_id: DataTypes.INTEGER,
    list_name: DataTypes.STRING,
    ele_id: DataTypes.INTEGER,
    ele_name: DataTypes.STRING,
    desc: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ListValues',
    timestamps:true
  });
  return ListValues;
};