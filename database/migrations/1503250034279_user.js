'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      table.string('password', 100).notNullable()
      table.string('user_name', 254).notNullable().unique()
      table.string('rol', 80).notNullable().defaultTo('user_cecc')
      table.timestamps()
    })
  }
  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
