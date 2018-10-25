'use strict'

const Model = use('Model')

class Activity extends Model {
  /**
   * Relaciona 1 - 1 la tabla Activitys con Users
   *
   * @method user
   *
   * @return {Object}
   */
  user () {
    return this.belongsTo('App/Models/User')
  }
   /**
   * Relaciona 1 - n, la tabla Activitys con Images
   *
   * @method images
   *
   * @return {Object}
   */
  images () {
    return this.belongsToMany('App/Models/Image')
  }
}

module.exports = Activity
