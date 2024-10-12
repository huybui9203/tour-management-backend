'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.Tour, {foreignKey: 'tour_id', targetKey: 'id', as: 'tour'})
    }
  }
  Schedule.init({
    day: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    tour_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Schedule',
    timestamps:true,
    paranoid: true,
  });
  return Schedule;
};