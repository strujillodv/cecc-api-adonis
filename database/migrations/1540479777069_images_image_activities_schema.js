'use strict'

const Schema = use('Schema')

class ImageActivitiesSchema extends Schema {
  up () {
    this.create('image_activities', (table) => {
      table.increments()
      table
        .integer('activity_id')
        .unsigned()
        .references('id')
        .inTable('activities')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .unique()
      table.string('public_id', 300).notNullable()
      table.string('version', 300).notNullable()
      table.string('path', 600).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('image_activities')
  }
}

module.exports = ImageActivitiesSchema
