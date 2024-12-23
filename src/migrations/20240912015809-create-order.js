'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      total_price: {
        type: Sequelize.FLOAT
      },
      order_date: {
        type: Sequelize.DATE
      },
      number_of_people: {
        type: Sequelize.INTEGER
      },
      pay_date: {
        type: Sequelize.DATE
      },
      rooms_count: {
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.INTEGER
      },
      cust_id: {
        type: Sequelize.INTEGER
      },
      tour_day_id: {
        type: Sequelize.INTEGER
      },
      list_status_id: {
        type: Sequelize.INTEGER
      }, 
      status_id: {
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Orders');
  }
};