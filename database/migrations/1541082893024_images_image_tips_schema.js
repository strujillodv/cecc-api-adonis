'use strict'

const Schema = use('Schema')

class ImageTipsSchema extends Schema {
  up () {
    this.create('image_tips', (table) => {
      table.increments()
      table
        .integer('tip_id')
        .unsigned()
        .references('id')
        .inTable('tips')
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
    this.drop('image_tips')
  }
}

module.exports = ImageTipsSchema
