'use strict'

const Model = use('Model')

class Record extends Model {
  /**
   * Indica que a cada usuario puede crear muchas reviciones
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
   * Indica que a cada reporte puede tener muchas reviciones
   * Relación n - 1 con la tabla reports
   *
   * @method report
   *
   * @return {Object}
   */
  report () {
    return this.belongsTo('App/Models/Api/V-1/Report')
  }
}

module.exports = Record
