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
}

module.exports = Organizer
