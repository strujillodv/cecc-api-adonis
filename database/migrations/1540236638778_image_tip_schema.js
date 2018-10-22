'use strict'

const Schema = use('Schema')

class ImageTipSchema extends Schema {
  up () {
    this.create('image_tips', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('image_tips')
  }
}

module.exports = ImageTipSchema
