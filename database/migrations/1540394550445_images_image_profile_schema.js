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
      table.string('cloudinary_id', 300).notNullable()
      table.string('public_id', 300).notNullable()
      table.string('version', 300).notNullable()
      table.string('path', 600).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('image_profiles')
  }
}

module.exports = ImageProfileSchema
