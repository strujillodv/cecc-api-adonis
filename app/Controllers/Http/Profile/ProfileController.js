'use strict'

// Llamamos al modelo Profile e Images de perfil
const Profile = use('App/Models/Profile/Profile')
// const imageProfile = use('App/Models/Image')

// LLamamos al Metodo Validador de AdonisJs
const { validate } = use('Validator')

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
      user_id: 'required|unique:profiles,user_id',
      slug: 'required|unique:profiles,slug'
    }

    // Almacenamos el id y el username del usuario autenticado
    const { id, user_name } = auth.user
    // Almacenamos la información que llega por request
    const data = request.only
    ([
      'first_name',
      'last_name',
      'treatment',
      'phone',
      'age'
    ])

    function  slugConverter(str) {

      str = str.replace(/^\s+|\s+$/g, ""); // trim
      str = str.toLowerCase();

      // eliminna accentos, comvierte ñ a n, entre otros
      var from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;"
      var to = "aaaaaaeeeeiiiioooouuuunc------"

      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
      }

      str = str
        .replace(/[^a-z0-9 -]/g, "") // eliminina los caracteres invalidos
        .replace(/\s+/g, "-") // colapsa los espacios y los remplaza por -
        .replace(/-+/g, "-") // colapsa y unifica los - diplicados
        .replace(/^-+/, "") // asegura que los guiones no aparecen al comienzo de la cadena
        .replace(/-+$/, ""); // asegura que los guiones no aparecen al final de la cadena

      return str // retorna la cadena limpia
    }

    // Agregamos el id del usuario autenticado
    data.user_id = id

    // Le asignamos un slug unico con el primer nombre y el username
    data.slug = slugConverter(data.first_name+' '+user_name)

    const validation = await validate(data, rules)

    // Comprobamos si falla la validación
    if (validation.fails()) {
      // Muestra un error 400 y el error de validacion que ocurrio
      return response.status(400).json(validation.messages())
    }

    // Manejo de excepciones
    try {
      // Almacenamos en la Base de Datos
      const profile = await Profile.create(data)

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
    // try{

    //   const Profile = await Profile.findOrFail(params.slug)

    //   const images = request.file('image', {
    //     types: ['image'],
    //     size: '5mb'
    //   })

    //   await images.moveAll(Helpers.tmpPath('uploads/profile'), file => ({
    //     name: `${Date.now()}-${file.clientName}`
    //   }))

    //   if (!images.movedAll()) {
    //     return images.errors()
    //   }

    //   await Promise.all(
    //     images
    //       .movedList()
    //       .map(image => property.images().create({ path: image.fileName }))
    //   )

    //   return response.status(200).json({
    //     status: 'sucess',
    //     data: 'Imagen cargada correctamente'
    //   })
    // }
    // catch (error){
    //   return response.status(400).json({
    //     status: 'error',
    //     data: error
    //   })
    // }
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
