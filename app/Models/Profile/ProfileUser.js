'use strict'

const Model = use('Model')

class ProfileUser extends Model {

  // Ocultamos los datos que no necesitamos ver cuando realizamos la consulta
  static get hidden () {
    return ['id', 'user_id', 'profile_id', 'image_id', 'created_at', 'updated_at']
  }

  // Relacionamos la tabla profile_user indicando que pertenece 1-1 a la tabla users
  user () {
    return this.belongsTo('App/Models/User')
  }

   // Relacionamos la tabla profile_user indicando que pertenece 1- 1 a la tabla profile
   information () {
    return this.belongsTo('App/Models/Profile/Profile')
  }

  image () {
    return this.belongsTo('App/Models/Image')
  }

}

module.exports = ProfileUser
