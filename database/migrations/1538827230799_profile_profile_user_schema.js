'use strict'

const Schema = use('Schema')

class ProfileUserSchema extends Schema {
  up () {
    this.create('profile_users', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .unique()
      table.string('slug', 600).notNullable().unique()
      table.string('url_image_profile', 600)
      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onUpdate('CASCADE')
      table
        .integer('image_id')
        .unsigned()
        .references('id')
        .inTable('images')
        .onUpdate('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('profile_users')
  }
}

module.exports = ProfileUserSchema
