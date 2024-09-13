'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Restaurants', [
      {
        name: 'Hanoi Skyline Lounge',
        address: '36B Gia Ngu Street Hanoi, Hà Nội',
        city: 'Hà Nội',
        rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'The Hung Ha Noi Snake Restaurant',
        address: '37 Ng. 137 Việt Hưng Long Biên, Hà Nội',
        city: 'Hà Nội',
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
   
  }
};
