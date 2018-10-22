'use strict'

const Model = use('Model')
const Hash = use('Hash')

class User extends Model {

  static boot () {
    super.boot()

    /**
     * hook que se ejecuta luego de la creación del usuario
     * con el cual se encripta el password en la base de datos
     */
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * Relacion requerida para almacenar los
   * tokens del usuario
   *
   * @method tokens
   *
   * @return {Object}
   */

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  /**
   * Relacion 1 - 1 con la tabla profiles
   *
   * @method profile
   *
   * @return {Object}
   */

  profile () {
    return this.hasOne('App/Models/Api/V-1/Profile')
  }

  /**
   * Metodo para ocultar los campos que no necesitamos mostrar
   * en la consulta.
   */
  static get hidden () {
    return ['password', 'created_at', 'updated_at']
  }
}

module.exports = User
