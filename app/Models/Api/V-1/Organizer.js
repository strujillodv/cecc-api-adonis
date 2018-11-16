'use strict'

const Model = use('Model')

class Organizer extends Model {
   /**
   * Indica que pertenece a una sola actividad cada organizador
   * Relación n - 1 con la tabla activities
   *
   * @method activity
   *
   * @return {Object}
   */
  activity () {
    return this.belongsTo('App/Models/Api/V-1/Activity')
  }

  /**
   * indica que cada organizador puede tener una imagen
   * Relación 1 - 1 con la tabla image_organizer
   *
   * @method image
   *
   * @return {Object}
   */
  image () {
    return this.hasOne('App/Models/Images/ImageOrganizer')
  }
}

module.exports = Organizer
