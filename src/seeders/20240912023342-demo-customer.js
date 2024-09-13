'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('Customers', [
      {
        name: 'Nguyễn Văn A',
        phone_number: '0123456789',
        address: 'Hà Nội',
        identity: null,
        age: 21,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nguyễn Văn B',
        phone_number: '0823818283',
        address: 'Hà Nội',
        identity: null,
        age: 21,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {})
  

  },

  async down (queryInterface, Sequelize) {

  }
};
