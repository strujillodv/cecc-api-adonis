'use strict'

const Model = use('Model')

class Profile extends Model {

  static get hidden () {
    return ['id','user_id']
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  images () {
    return this.belongsToMany('App/Models/Image')
    .pivotTable('images_profiles')
  }

}

module.exports = Profile
