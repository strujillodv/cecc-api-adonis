'use strict'

const Model = use('Model')

class Profile extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }
  images () {
    return this.belongsToMany('App/Models/Image')
  }
}

module.exports = Profile
