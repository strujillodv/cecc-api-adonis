'use strict'

const Schema = use('Schema')

class ImageReportsSchema extends Schema {
  up () {
    this.create('image_reports', (table) => {
      table.increments()
      table
        .integer('report_id')
        .unsigned()
        .references('id')
        .inTable('reports')
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
    this.drop('image_reports')
  }
}

module.exports = ImageReportsSchema
