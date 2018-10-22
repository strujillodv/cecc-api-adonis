'use strict'

const Schema = use('Schema')

class ImageActivitySchema extends Schema {
  up () {
    this.create('image_activities', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('image_activities')
  }
}

module.exports = ImageActivitySchema
