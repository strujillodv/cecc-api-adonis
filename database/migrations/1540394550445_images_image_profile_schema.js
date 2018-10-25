'use strict'

const Schema = use('Schema')

class ImageProfileSchema extends Schema {
  up () {
    this.create('image_profiles', (table) => {
      table.increments()
      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('path', 600).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('image_profiles')
  }
}

module.exports = ImageProfileSchema
