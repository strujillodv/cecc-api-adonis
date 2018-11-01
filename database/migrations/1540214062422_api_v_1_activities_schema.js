'use strict'

const Schema = use('Schema')

class ActivitiesSchema extends Schema {
  up () {
    this.create('activities', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('slug', 600).notNullable().unique()
      table.string('title', 300).notNullable()
      table.string('type', 300).notNullable().defaultTo('Recreación')
      table.date('date_event').notNullable()
      table.string('hour', 10).notNullable()
      table.string('short_description', 300).notNullable()
      table.string('description', 1000).notNullable()
      table.decimal('latitude',9,6).notNullable()
      table.decimal('longitude',9,6).notNullable()
      table.string('address', 400).notNullable()
      table.string('neighborhood', 400).notNullable()
      table.string('location', 400).notNullable().defaultTo('Chapinero')
      table.timestamps()
    })
  }

  down () {
    this.drop('activities')
  }
}

module.exports = ActivitiesSchema
