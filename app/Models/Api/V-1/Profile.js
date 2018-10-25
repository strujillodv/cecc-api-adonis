'use strict'

const Model = use('Model')

class Profile extends Model {
  /**
   * Relaciona 1 - 1 la tabla Proflies con Users
   *
   * @method user
   *
   * @return {Object}
   */
  user () {
    return this.belongsTo('App/Models/User')
  }
  /**
   * Relaciona 1 - n, la tabla Proflies con Images
   *
   * @method images
   *
   * @return {Object}
   */
  images () {
    return this.hasMany('App/Models/Images/ImageProfile')
  }
}

module.exports = Profile
