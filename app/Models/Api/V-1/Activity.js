'use strict'

const Model = use('Model')

class Activity extends Model {
  /**
   * Indica que a cada usuario le pueden pertenecer muchas actividades
   * Relación n - 1 con la tabla users
   *
   * @method user
   *
   * @return {Object}
   */
  user () {
    return this.belongsTo('App/Models/User')
  }

  /**
   * Indica que cada actividad puede tener muchos organizadores
   * Relaciona 1 - n con la tabla Images
   *
   * @method organizers
   *
   * @return {Object}
   */
  organizers () {
    return this.hasMany('App/Models/Api/V-1/Organizer')
  }

  /**
   * Indica que cada actividad puede tener muchas imagenes
   * Relaciona 1 - n con la tabla image_activities
   *
   * @method images
   *
   * @return {Object}
   */
  images () {
    return this.hasMany('App/Models/Images/ImageActivity')
  }
}

module.exports = Activity
