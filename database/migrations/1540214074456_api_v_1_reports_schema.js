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
      table.string('number', 20).notNullable().unique()
      table.string('type', 100).notNullable()
      table.string('title', 300).notNullable()
      table.string('description', 1000).notNullable()
      table.string('status', 30).notNullable().defaultTo('Abierto')
      table.decimal('latitude',9,6).notNullable()
      table.decimal('longitude',9,6).notNullable()
      table.string('address', 400).notNullable()
      table.string('neighborhood', 400).notNullable()
      table.string('location', 400).notNullable().defaultTo('Chapinero')
      table.timestamps()
    })
  }

  down () {
    this.drop('reports')
  }
}

module.exports = ReportsSchema
