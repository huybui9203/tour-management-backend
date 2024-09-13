'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.Account, {foreignKey: 'id'})
    }
  }
  Role.init({
    role_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    timestamps: false,
  });
  return Role;
};