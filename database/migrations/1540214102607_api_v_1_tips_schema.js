'use strict'

const Schema = use('Schema')

class TipsSchema extends Schema {
  up () {
    this.create('tips', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('slug', 600).notNullable().unique()
      table.string('type', 100).notNullable()
      table.string('title', 600).notNullable()
      table.string('description', 800).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tips')
  }
}

module.exports = TipsSchema
