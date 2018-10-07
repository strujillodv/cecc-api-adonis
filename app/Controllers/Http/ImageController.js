'use strict'

// const Image = use('App/Models/Profile/Profile')

const Helpers = use('Helpers')

class ImageController {

  async show ({ params, response }) {

    return response.download(Helpers.tmpPath(`uploads/profile/${params.path}`))

  }

}

module.exports = ImageController
