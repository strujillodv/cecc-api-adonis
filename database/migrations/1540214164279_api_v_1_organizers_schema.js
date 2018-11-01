'use strict'

const Schema = use('Schema')

class OrganizersSchema extends Schema {
  up () {
    this.create('organizers', (table) => {
      table.increments()
      table
        .integer('activity_id')
        .unsigned()
        .references('id')
        .inTable('activities')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('name', 600).notNullable()
      table.string('link_web', 600).notNullable()
      table.string('link_faceboock', 600).notNullable()
      table.string('email', 600).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('organizers')
  }
}

module.exports = OrganizersSchema
