'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Hotels', [
      {
      name: 'InterContinental Hanoi Westlake',
      address: '05 Tu Hoa Tay Ho, Hanoi',
      city: 'Hà Nội',
      rating: 4.5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, 
    {
      name: 'Khách sạn Melia Hà Nội',
      address: '44 P. Lý Thường Kiệt, Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
      city: 'Hà Nội',
      rating: 4.5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, 
    {
      name: 'Pan Pacific Hanoi',
      address: 'Số 1, Đường Thanh Niên, Quận Ba Đình, Quận Tây Hồ, Hà Nội',
      city: 'Hà Nội',
      rating: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    ], {});
  },

  async down (queryInterface, Sequelize) {
   
  }
};
