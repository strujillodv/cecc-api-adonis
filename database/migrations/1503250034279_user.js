'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('user_name', 250).notNullable().unique()
      table.string('email', 300).notNullable().unique()
      table.string('password', 100).notNullable()
      table.string('rol', 20).notNullable().defaultTo('user_cecc')
      table.timestamps()
    })
  }
  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
