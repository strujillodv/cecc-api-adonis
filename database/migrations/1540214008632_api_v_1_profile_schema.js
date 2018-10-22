'use strict'

const Schema = use('Schema')

class ProfileSchema extends Schema {
  up () {
    this.create('profiles', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .unique()
      table.string('slug', 600).notNullable().unique()
      table.string('first_name', 300).notNullable()
      table.string('last_name', 300).notNullable()
      table.string('treatment', 10).notNullable().defaultTo('Sr(a).')
      table.string('phone', 25).notNullable()
      table.integer('age', 3).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('profiles')
  }
}

module.exports = ProfileSchema
