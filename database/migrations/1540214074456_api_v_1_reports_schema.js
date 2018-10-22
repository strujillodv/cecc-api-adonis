'use strict'

const Schema = use('Schema')

class ReportsSchema extends Schema {
  up () {
    this.create('reports', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('slug', 600).notNullable().unique()
      table.string('number', 10).notNullable().unique()
      table.string('type', 300).notNullable()
      table.string('description', 800).notNullable()
      table.string('status', 30).notNullable().defaultTo('Abierto')
      table.decimal('latitude',9,6).notNullable()
      table.decimal('longitude',9,6).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('reports')
  }
}

module.exports = ReportsSchema
