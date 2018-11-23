'use strict'

/*
 * Modelos
 */
const Profile = use('App/Models/Api/V-1/Profile')

/*
 * Metodos
 */
const { validate } = use('Validator')
const Cloudinary = use('App/Services/CloudinaryService')

class ProfileController {
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

      await profile.load('image')

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
      // Buscamos en la bases de datos si hay un registro que concida con el slug
      const profile = await Profile.findByOrFail('slug', params.slug)
      // Carga la inforamción del usuario
      await profile.load('user')
      // Carga las imagenes del usuario
      await profile.load('image')
      return response.status(201).json({
        status: 'success',
        data: profile
      })
    }
    catch (error) {
      // Si no hay un registro que coincida muestra error
      if (Object.keys(error).length === 0) error=`A ocurrido un error al buscar el perfil de ${params.slug}`
      return response.status(400).json({
        status: 'error',
        message: error
      })
    }
  }

  /**
   * Actualiza la información del perfil de usuario.
   * PUT profile/:id
   */
  async update ({ auth, params, request, response }) {
    //Obtenemos el username del usuario autenticado y se almacena en una nueva const user_name
    const { user_name } = auth.user
    // Validamos que el usuario autenticado este intentando modificar su perfil
    if (user_name === params.slug) {
      try {
        // Busca el perfi del usuario
        const profile = await Profile.findByOrFail('slug', params.slug)
        // almacena la nueva información en la const data
        const data = request.only
        ([
          'first_name',
          'last_name',
          'treatment',
          'phone',
          'age'
        ])
        // método que solo modifica los atributos especificados.
        profile.merge(data)
        // metodo para persistir los cambios en la base de datos
        await profile.save()
        // retorna la respuesta exitosa
        return response.status(201).json({
          status: 'success',
          data: profile
        })
      } catch (error) {
        // Si no se pudo actualizar muestra un error
        if (Object.keys(error).length === 0) error=`A ocurrido un error al buscar el perfil de ${params.slug}`
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }

    } else {
      // Si no es el perfil del usuario autenticado muestra un error
      return response.status(400).json({
        status: 'error',
        message: 'No tiene permiso para hacer modificiones en este perfil'
      })
    }
  }

  /**
   * Elimina el perfil de usuario selecionado por id.
   * DELETE profile/:id
   */
  async destroy ({ params, request, response }) {
  }

  /**
   * Se encarga de subir una imagen de perfil de usuario.
   * El atributo en el formulario se debe llamar image
   * para cargar la imagen
   *
   * POST profile/:slug/image
   */
  async imageUpload ({params, request, response }) {

    // almacena la imagenen que llega por request
    try {

      // Busca el perfil de usuario por slug
      const profile = await Profile.findByOrFail('slug', params.slug)

      // almacenamos la imagen cargada en la const fie
      const file = request.file('image')

      // cargamos la imagen de usuario con el servicio de cloudinary
      const cloudinaryMeta = await Cloudinary.v2.uploader.upload(
        file.tmpPath,
        {
          // le asignamos como public_id el valor almacenado en el slug del perfil
          public_id: profile.slug,
          // Le indicamos a cloudinary que almacene la imagen en una carpeta llamada profiles
          // en caso de no existir la creara
          folder: 'profiles',
          width: 720
        }
      )
      // almacenamos la informacion de la imagen almacenada en la tabla image_profiles
      const img = await profile.image().create({
        cloudinary_id: cloudinaryMeta.public_id.split('/')[1],
        public_id: cloudinaryMeta.public_id,
        version: cloudinaryMeta.version,
        path: cloudinaryMeta.secure_url
      })
      // devuelve los datos de la imagen de perfil almacenada
      return response.status(200).json({
        status: 'success',
        data: img
      })
    }
    catch (error) {
      // Muestra un mensaje de error si no se guarda la imagen
      return response.status(400).json({
        status: 'error',
        error: error,
        msg: 'eror inesperado al guardar imagen'
      })
    }
  }

  /**
   * Se encarga de actualizar la imagen de perfil de usuario.
   * El atributo en el formulario se debe llamar image
   * para cargar la imagen
   * PUT profile/:slug/image
   */
  async imageUpdate ({params, request, response }) {
    try {
      // Busca el perfil de usuario por slug
      const profile = await Profile.findByOrFail('slug', params.slug)

      // almacena la imagen que llegan por request en la const file
      const file = request.file('image')
      // cargamos la imagen de usuario con el servicio de cloudinary
      const cloudinaryMeta = await Cloudinary.v2.uploader.upload(
        file.tmpPath,
        {
          public_id: profile.slug,
          folder: 'profiles',
          width: 720
        }
      )
      // actualizamos la informacion de la imagen almacenada en la tabla image_profiles
      let img = await profile.image().where('public_id', cloudinaryMeta.public_id).update({
        public_id: cloudinaryMeta.public_id,
        version: cloudinaryMeta.version,
        path: cloudinaryMeta.secure_url
      })
      await profile.load('image')
      // muestra la nueva imagen de perfil almacenada
      return response.status(200).json({
        status: 'success',
        data: img
      })
    }
    catch (error) {
      // muestra un error si algo inseperado ocurre
      return response.status(400).json({
        status: 'error',
        error: error,
        msg: 'eror inesperado al actualizar la imagen'
      })
    }
  }
}

module.exports = ProfileController
