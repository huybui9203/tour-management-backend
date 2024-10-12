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
      total_day: {
        type: Sequelize.STRING
      },
      departure_point: {
        type: Sequelize.STRING
      },
      destination: {
        type: Sequelize.STRING
      },
      img_url: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      res_id: {
        type: Sequelize.INTEGER
      },
      hotel_id: {
        type: Sequelize.INTEGER
      },
      list_type_id: {
        type: Sequelize.INTEGER
      },
      type_id: {
        type: Sequelize.INTEGER
      },

      list_veh_id: {
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
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tours');
  }
};