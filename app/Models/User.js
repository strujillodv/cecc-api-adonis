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
   * Indica que a cada usuario solo le pertenece un perfil
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
   * Indica que cada usuario puede crear varios tips
   * Solo los administradores pueden acceder a este metodo
   * Relacion 1 - n con la tabla tips
   *
   * @method tips
   *
   * @return {Object}
   */

  tips () {
    return this.hasMany('App/Models/Api/V-1/Tip')
  }

  /**
   * Indica que cada usuario puede crear varias actividades
   * Solo los administradores pueden acceder a este metodo
   * Relacion 1 - n con la tabla activities
   *
   * @method activities
   *
   * @return {Object}
   */

  activities () {
    return this.hasMany('App/Models/Api/V-1/Activity')
  }

  /**
   * Indica que cada usuario puede hacer varias revisiones a los reportes
   * Solo los administradores pueden acceder a este metodo
   * Relacion 1 - n con la tabla hystory
   *
   * @method records
   *
   * @return {Object}
   */

  records () {
    return this.hasMany('App/Models/Api/V-1/Record')
  }

  /**
   * Indica que cada usuario puede crear varios reportes
   * Cualquier usuario los puede crear
   * Relacion 1 - n con la tabla reports
   *
   * @method reports
   *
   * @return {Object}
   */

  reports () {
    return this.hasMany('App/Models/Api/V-1/Report')
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
