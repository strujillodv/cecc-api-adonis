'use strict'

const Model = use('Model')

class Tip extends Model {

  /**
   * Indica que a cada usuario puede crear muchos tips
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
   * Indica que cada tip puede tener muchas imagenes
   * Relaciona 1 - n con la tabla image_reports
   *
   * @method images
   *
   * @return {Object}
   */
  images () {
    return this.hasMany('App/Models/Images/ImageTip')
  }
}

module.exports = Tip
