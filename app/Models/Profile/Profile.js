'use strict'

const Model = use('Model')

class Profile extends Model {

  // Ocultamos los datos que no necesitamos ver cuando realizamos la consulta
  static get hidden () {
    return ['id', 'created_at', 'updated_at']
  }
}

module.exports = Profile
