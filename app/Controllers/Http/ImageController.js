'use strict'

const Helpers = use('Helpers')

class ImageController {

  /*
   * Metodo que muestra las imagenes del perfil de usuario
   * @method profiles
   */
  async profiles ({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/profiles/${params.path}`))
  }

  /*
   * Metodo que muestra las imagenes de las actividades
   * @method activities
   */
  async activities ({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/activyty/${params.path}`))
  }

  /*
   * Metodo que muestra las imagenes de los reportes
   * @method reports
   */
  async reports ({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/reports/${params.path}`))
  }

  /*
   * Metodo que muestra las imagenes de los tips
   * @method tips
   */
  async tips ({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/tips/${params.path}`))
  }

}

module.exports = ImageController
