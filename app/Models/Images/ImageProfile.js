'use strict'

const Env = use('Env')

const Model = use('Model')

class ImageProfile extends Model {
  static get computed () {
    return ['url']
  }

  getUrl ({ path }) {
    return `${Env.get('APP_URL')}/images/profiles/${path}`
  }
}

module.exports = ImageProfile
