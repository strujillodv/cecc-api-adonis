'use strict'

const Env = use('Env')
const Model = use('Model')

class ImageActivity extends Model {
  static get computed () {
    return ['url']
  }

  getUrl ({ path }) {
    return `${Env.get('APP_URL')}/images/activities/${path}`
  }
}

module.exports = ImageActivity
