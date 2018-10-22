'use strict'

const Schema = use('Schema')

class ImageProfileSchema extends Schema {
  up () {
    this.create('image_profile', (table) => {
      table.increments()
      table
        .integer('image_id')
        .unsigned()
        .references('id')
        .inTable('images')
        .onUpdate('CASCADE')
      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onUpdate('CASCADE')
    })
  }

  down () {
    this.drop('image_profile')
  }
}

module.exports = ImageProfileSchema
