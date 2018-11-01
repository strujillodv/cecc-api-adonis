'use strict'

const Schema = use('Schema')

class RecordSchema extends Schema {
  up () {
    this.create('record', (table) => {
      table.increments()
      table.string('title', 300).notNullable()
      table.string('description', 1000).notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
      table
        .integer('report_id')
        .unsigned()
        .references('id')
        .inTable('reports')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('record')
  }
}

module.exports = RecordSchema
