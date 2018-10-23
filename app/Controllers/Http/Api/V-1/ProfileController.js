'use strict'

/*
 * Modelos y recursos a implementar
 */

const Profile = use('App/Models/Api/V-1/Profile')

const { validate } = use('Validator')

class ProfileController {
  /**
   * Muestra una lista de todos los perfiles.
   * GET profile
   */
  async index ({ request, response, view }) {
  }

  /**
   * Crea o genera un nuevo perfil de usuario.
   * POST profile
   */
  async store ({auth, request, response}) {

    // Definimos reglas para validar los datos que le llegan a la api
    const rules = {
      first_name: 'required'
    }

    //Obtenemos el id y el username del usuario autenticado y se alacena en una nueva const
    const { id, user_name } = auth.user

    // Obtenmos la información por request y la almacenamos en la const data
    const data = request.only
    ([
      'first_name',
      'last_name',
      'treatment',
      'phone',
      'age'
    ])
    data.user_id = id
    data.slug = user_name

    // Validamos la información obtenida por el request, con las reglas ya definidas
    const validation = await validate(data, rules)

    // Comprobamos si falla la validación
    if (validation.fails()) {
      // Muestra un error 400 y el error de validacion que ocurrio
      return response.status(400).json(validation.messages())
    }

    // Manejo de excepciones
    try {

      // Almacenamos la información en la Base de Datos
      const profile = await Profile.create(data)

      await profile.load('user')

      await profile.load('images')

      // Enviamos los datos almacenados
      return response.status(201).json({
        status: 'success',
        data: profile
      })

    } catch (error){
      if (Object.keys(error).length === 0) error =`A ocurrido un error al intentar guardar el perfil de ${user_name}`
      // Responde a la aplicaion si se produce un error al guardar la información
      return response.status(400).json({
        status: 'error',
        message: error
      })
    }
  }

  /**
   * Muestra el perfil del usuario selecionado por el valor del campo slug
   * de la tabla profiles.
   *
   * GET profile/:slug
   * @return {profile}
   */
  async show ({ params, response }) {
    try {
      const profile = await Profile.findByOrFail('slug', params.slug)
      await profile.load('user')
      await profile.load('images')
      return response.status(201).json({
        status: 'success',
        data: profile
      })
    }
    catch (error) {
      if (Object.keys(error).length === 0) error=`A ocurrido un error al buscar el perfil de ${params.slug}`
      return response.status(400).json({
        status: 'error',
        message: error
      })
    }
  }

  /**
   * Actualiza la información del perfil de usuario.
   * PUT or PATCH profile/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Elimina el perfil de usuario selecionado por id.
   * DELETE profile/:id
   */
  async destroy ({ params, request, response }) {
  }

  /**
   * Elimina un usuario selecionado por id.
   * DELETE profile/:id
   */
  async storeImage ({params, request, response }) {

    const profile = await Profile.findByOrFail('slug', params.slug)

    const images = request.file('image', {
      types: ['image'],
      size: '5mb'
    })

    await images.moveAll(Helpers.tmpPath('uploads/profile'), file => ({
      name: `${Date.now()}-${file.clientName}`
    }))

    if (!images.movedAll()) {
      return images.errors()
    }

    await Promise.all(
      images
        .movedList()
        .map(image => profile.images().create({ path: image.fileName }))
    )

    await profile.load('images')

    return response.status(200).json({
      status: 'error',
      data: params, profile, images
    })
  }
}

module.exports = ProfileController
