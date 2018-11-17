'use strict'

const Schema = use('Schema')

class ImageOrganizersSchema extends Schema {
  up () {
    this.create('image_organizers', (table) => {
      table.increments()
      table
        .integer('organizer_id')
        .unsigned()
        .references('id')
        .inTable('organizers')
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
    this.drop('image_organizers')
  }
}

module.exports = ImageOrganizersSchema
