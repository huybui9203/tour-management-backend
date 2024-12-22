'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    
    static associate(models) {
      Image.belongsTo(models.Tour, {foreignKey: 'tour_id', as: 'tour', targetKey: 'id'})

    }
  }
  Image.init({
    img_url: DataTypes.STRING,
    tour_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};