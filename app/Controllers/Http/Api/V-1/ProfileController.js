'use strict'

/*
 * Modelos y recursos a implementar
 */

const Profile = use('App/Models/Api/V-1/Profile')

const { validate } = use('Validator')

const Helpers = use('Helpers')

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
      // Buscamos en la bases de datos si hay un registro que concida con el slug
      const profile = await Profile.findByOrFail('slug', params.slug)
      // Carga la inforamción del usuario
      await profile.load('user')
      // Carga las imagenes del usuario
      await profile.load('images')
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
   * PUT or PATCH profile/:id
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
   * Se encarga de subir imagenes al perfil de usuario.
   * El atributo en el formulario se debe llamr
   * image[]
   * para cargar varias imagenes
   * POST profile/:slug/images
   */
  async profileImages ({params, request, response }) {

    // Busca el perfil de usuario por slug
    const profile = await Profile.findByOrFail('slug', params.slug)

    // almacena las imagenes que llegan por request
    const images = request.file('image', {
      types: ['image'],
      size: '3mb'
    })

    // Mueve los archivos guardados a la carpeta uploads/profiles/
    await images.moveAll(Helpers.tmpPath('uploads/profiles/'), file => ({
      // renombra los archivos
      name: `${Date.now()}-${file.clientName}`
    }))

    // Identifica si hubo algun error al mover las imagenes, si lo hubo muestra un error
    if (!images.movedAll()) {
      return images.errors()
    }

    // Almacena el path de las imagenes en la tabla de imagenes relacionada con los perfiles
    await Promise.all(
      images
        .movedList()
        .map(image => profile.images().create({ path: image.fileName }))
    )

    // carga lazy de las imagenes de usuario
    await profile.load('images')

    // muestra el perfil de usuario con las imagenes almacenadas
    return response.status(200).json({
      status: 'error',
      data: profile
    })
  }
}

module.exports = ProfileController
