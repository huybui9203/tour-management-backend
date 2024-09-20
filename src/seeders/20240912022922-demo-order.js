'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Orders', [{
      total_price: 10000000,
      deposit: 3000000,
      order_date: new Date(),
      number_of_people: 2,
      children_count: 2,
      adults_count: 2,
      pay_date: new Date(),
      employee_id: 2,
      cust_id: 1,
      tour_day_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
  
  }
};
