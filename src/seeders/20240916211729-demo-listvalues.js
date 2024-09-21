"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "ListValues",
            [
                {
                    //         list_id: 1,
                    // list_name: 'order status',
                    // ele_id: 1,
                    // ele_name: 'đang xử lý',
                    // desc: null,
                    // tour_id: null,
                    // order_id: 2
                    // acc_id
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {},
};
