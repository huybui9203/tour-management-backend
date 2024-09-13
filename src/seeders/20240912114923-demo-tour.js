'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Tours', [{
      order_num: '1',
      name: 'Hà Nội - Bái Đính - Tràng An - Hạ Long - Yên Tử Việt Nam Dưới Cánh Chim Bay',
      description: null,
      price: 5000000,
      promo: null,
      number_of_guests: 2,
      start_date: new Date(),
      end_date: new Date(),
      departure_point: 'Hà Nội',
      img_url: null,
      destination: 'Hà Nội',
      rating: 5,
      tour_type: null,
      res_id: 2,
      hotel_id: 2,
      veh_id: 1,
      createdAt: new Date(),
        updatedAt: new Date(),
     }], {});
    
  },

  async down (queryInterface, Sequelize) {
   
  }
};
