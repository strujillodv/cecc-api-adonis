'use strict'

const Helpers = use('Helpers')

class ImageController {

  async profiles ({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/profiles/${params.path}`))
  }
  async activitys ({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/activyty/${params.path}`))
  }

}

module.exports = ImageController
