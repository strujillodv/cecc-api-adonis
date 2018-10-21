'use strict'

// Llamamos al modelo ProfileUser
const Profile = use('App/Models/Profile/ProfileUser')
const Info = use('App/Models/Profile/Profile')
// const imageProfile = use('App/Models/Image')

// LLamamos al Metodo Validador de AdonisJs
const { validateAll } = use('Validator')

const Helpers = use('Helpers')


class ProfileController {

  /**
   * Show a list of all profiles.
   * GET profiles
   */
  async index ({ request, response }) {
  }


  /**
   * Create/save a new profile.
   * POST profiles
   */
  async store ({auth, request, response }) {

    // Definimos reglas para validar los datos que le llegan a la api
    const rules = {
      first_name: 'required',
      last_name: 'required'
    }

    // Almacenamos el id y el username del usuario autenticado en el objeto data
    // para alimentar la tabla de profile_user
    const { id, user_name } = auth.user
    // Almacenamos la información que llega por request que se almacenara en la tabla profiles
    const data = request.only
    ([
      'first_name',
      'last_name',
      'treatment',
      'phone',
      'age'
    ])

    const validation = await validateAll(data, rules)

    // Comprobamos si falla la validación
    if (validation.fails()) {
      // Muestra un error 400 y el error de validacion que ocurrio
      return response.status(400).json(validation.messages())
    }

    // Manejo de excepciones
    try {

      const infoProfile= await Info.create(data)
      // Almacenamos en la Base de Datos
      // Agregamos el id del usuario autenticado
       // Le asignamos un slug unico con el username
      const profile = await Profile.create({user_id: id, slug: user_name, profile_id: infoProfile.id})
      // Almacenamos información del perfil
      // await profile.profile.create(data)

      await profile.load('information')

      await profile.load('user')

      // Enviamos los datos almacenados
      return response.status(201).json({
        status: 'success',
        data: profile
      })

    } catch (error){
      // Responde a la aplicaion si se produce un error al guardar la información
      return response.status(400).json({
        status: 'error',
        message: error
      })
    }

  }

  /**
   * Display a single profile.
   * GET profiles/:id
   */
  async show ({ params, response }) {

    try {
      const profile = await Profile.findByOrFail('slug', params.id)

      // Cargamos las imagenes que contenga el perfil
      await profile.load('images')

      // Enviamos los datos almacenados
      return response.status(200).json({
        status: 'success',
        data: profile
      })
    } catch (error){
      // Responde a la aplicaion si se produce un error al guardar la información
      return response.status(400).json({
        status: 'error',
        message: error
      })
    }
  }


  /**
   * Update profile details.
   * PUT or PATCH profiles/:id
   */
  async update ({ auth, params, request, response }) {

    const { id } = auth.user

    if(params.id === id){

      const profile = await Profile.findOrFail(params.id)

      // Almacenamos la información que llega por request
      const data = request.only
      ([
        'first_name',
        'last_name',
        'treatment',
        'phone',
        'age'
      ])

      profile.merge(data)

      await profile.save()

      // Enviamos error de acceso
      return response.status(400).json({
        status: 'success',
        data: 'Datos actualizados correctamente'
      })

    }else {
      // Enviamos error de acceso
      return response.status(400).json({
        status: 'error',
        data: 'Acceso no autorizado'
      })
    }
  }

  /**
   * Delete a profile with id.
   * DELETE profiles/:id
   */
  async destroy ({ params, request, response }) {
  }

  /**
   * Create/save a new image of profile.
   * POST profiles/:slug/images
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
