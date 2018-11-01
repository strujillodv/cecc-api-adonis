'use strict'

const Model = use('Model')

class Profile extends Model {
  /**
   * indica que cada perfil esta relacionado con solo un usuario
   * Relaciona 1 - 1 la tabla Users
   *
   * @method user
   *
   * @return {Object}
   */
  user () {
    return this.belongsTo('App/Models/User')
  }

  /**
   * indica que cada perfil puede tenr varias imagenes
   * Relación 1 - n con la tabla image_profiles
   *
   * @method images
   *
   * @return {Object}
   */
  image () {
    return this.hasOne('App/Models/Images/ImageProfile')
  }
}

module.exports = Profile
