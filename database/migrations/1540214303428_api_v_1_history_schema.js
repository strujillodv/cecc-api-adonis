'use strict'

const Schema = use('Schema')

class HistorySchema extends Schema {
  up () {
    this.create('history', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
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
    this.drop('history')
  }
}

module.exports = HistorySchema
