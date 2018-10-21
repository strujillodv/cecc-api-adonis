'use strict'

const Model = use('Model')
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  /**
   * Oculta el  password cuando el usuario es consultado.
   */
  static get hidden () {
    return ['password', 'created_at', 'updated_at']
  }


  /**
   *Relacionamos la tabla users 1 - 1 con la tabla profile_users
   */
  profile () {
    return this.hasOne('App/Models/Profile/ProfileUser')
  }
}

module.exports = User
