'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
    await queryInterface.bulkInsert('admins', [{
      email: 'rehan@gmail.com',
      password:"rehan@123",
      createdAt:"2026-07-16 04:55:26",
      updatedAt:"2026-07-16 04:55:26"
    }]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    */
    await queryInterface.bulkDelete('admin', null, {});
  }
};
