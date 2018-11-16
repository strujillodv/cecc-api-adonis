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
   * indica que cada perfil puede tener una imagen
   * Relación 1 - 1 con la tabla image_profiles
   *
   * @method image
   *
   * @return {Object}
   */
  image () {
    return this.hasOne('App/Models/Images/ImageProfile')
  }
}

module.exports = Profile
