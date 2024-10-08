'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    static associate(models) {
      Participant.belongsTo(models.Order, {foreignKey: 'order_id', targetKey:'id', as: 'order'})
    }
  }
  Participant.init({
    name: DataTypes.STRING,
    sex: DataTypes.BOOLEAN,
    date_of_birth: DataTypes.DATE,
    price_for_one: DataTypes.FLOAT,
    order_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Participant',
    paranoid: true,
  });
  return Participant;
};