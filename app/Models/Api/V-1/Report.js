'use strict'

const Model = use('Model')

class Report extends Model {
  /**
   * Indica que a cada usuario puede crear muchos reportes
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
   * Indica que cada actividad puede tener muchas revisiones
   * Relaciona 1 - n con la tabla history
   *
   * @method record
   *
   * @return {Object}
   */
  record () {
    return this.hasMany('App/Models/Api/V-1/History')
  }

  /**
   * Indica que cada reporte puede tener muchas imagenes
   * Relaciona 1 - n con la tabla image_reports
   *
   * @method images
   *
   * @return {Object}
   */
  images () {
    return this.hasMany('App/Models/Images/ImageReport')
  }
}

module.exports = Report
