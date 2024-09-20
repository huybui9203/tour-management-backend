'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Tours', [{
      name: 'Hà Nội - Bái Đính - Tràng An - Hạ Long - Yên Tử Việt Nam Dưới Cánh Chim Bay',
      description: null,
      price: 5000000,
      promo: null,
      number_of_guests: 2,
      departure_point: 'Hà Nội',
      destination: 'Hà Nội',
      img_url: null,
      rating: 5,
      status: 1,
      res_id: 2,
      hotel_id: 2,
      createdAt: new Date(),
        updatedAt: new Date(),
     }], {});
    
  },

  async down (queryInterface, Sequelize) {
   
  }
};
