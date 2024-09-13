'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Employees', [{
      name: 'Nguyễn Đình Tiếp',
      position: 'nhân viên',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Nguyễn Sỹ Hà',
      position: 'nhân viên',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      name: 'Nguyễn Văn Anh',
      position: 'nhân viên',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {

  }
};
