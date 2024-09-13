'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('OrderStatuses', [{
      status: 'đang chờ',
 
    },
    {
      status: 'đã xác nhận',
     
    }, 
    {
      status: 'đã thanh toán',
     
    }, {
      status: 'đã hủy',
      
    }], {});

  },

  async down (queryInterface, Sequelize) {
 
  }
};
