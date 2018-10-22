'use strict'

const Schema = use('Schema')

class ImageReportSchema extends Schema {
  up () {
    this.create('image_reports', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('image_reports')
  }
}

module.exports = ImageReportSchema
