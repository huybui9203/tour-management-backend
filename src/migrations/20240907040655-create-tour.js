'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tours', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_num: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.FLOAT
      },
      promo: {
        type: Sequelize.FLOAT
      },
      number_of_guests: {
        type: Sequelize.INTEGER
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      departure_point: {
        type: Sequelize.STRING
      },
      img_url: {
        type: Sequelize.STRING
      },
      destination: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.FLOAT
      },
      tour_type: {
        type: Sequelize.INTEGER
      },
      res_id: {
        type: Sequelize.INTEGER
      },
      hotel_id: {
        type: Sequelize.INTEGER
      },
      veh_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tours');
  }
};