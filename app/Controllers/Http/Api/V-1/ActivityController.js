'use strict'
const Env = use('Env')
/*
 * Modelos y recursos a implementar
 */

const Activity = use('App/Models/Api/V-1/Activity')

const { validate, sanitizor } = use('Validator')

const Helpers = use('Helpers')

class ActivityController {

  /**
   * Muestra todas las actividades.
   * GET activities
   */
  async index () {

    const activity = Activity.all()

    return activity
  }

  /**
   * Crea y guarda una nueva actividad.
   * POST activities
   */
  async store ({ auth, request, response }) {

    //Obtenemos el id y el username del usuario autenticado y se alacena en una nueva const
    const { id, rol } = auth.user

    if (rol === Env.get('ADMIN_TYPE')) {
      // Definimos reglas para validar los datos que le llegan a la api
      const rules = {
        title: 'required',
        date_event: 'required|dateFormat:YYYY-MM-DD',
        hour: 'required',
        latitude: 'required',
        longitude: 'required',
        address: 'required',
        neighborhood: 'required'
      }

      // Obtenmos la información por request y la almacenamos en la const data
      const data = request.only
      ([
        'title',
        'type',
        'date_event',
        'hour',
        'short_description',
        'description',
        'latitude',
        'longitude',
        'address',
        'neighborhood',
        'location'
      ])
      data.user_id = id
      data.slug = sanitizor.slug(`${data.title} ${data.address} ${data.location}`)

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
        const activity = await Activity.create(data)

        // Enviamos los datos almacenados
        return response.status(201).json({
          status: 'success',
          data: activity
        })

      } catch (error){
        if (Object.keys(error).length === 0) error =`A ocurrido un error al intentar crear la actividad`
        // Responde a la aplicaion si se produce un error al guardar la información
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }
    } else {
      return response.status(400).json({
        status: 'error',
        message: 'No tiene autorización para crear actividades'
      })
    }
  }

  /**
   * Consulta la actividad por slug.
   * GET activities/:id
   */
  async show ({ params, response }) {
    try {
      const activity = await Activity.findByOrFail('slug', params.slug)
      await activity.load('user.profile')
      // await activity.load('images')
      return response.status(201).json({
        status: 'success',
        data: activity
      })
    }
    catch (error) {
      if (Object.keys(error).length === 0) error=`A ocurrido un error al buscar la actividad ${params.slug}`
      return response.status(400).json({
        status: 'error',
        message: error,
      })
    }
  }

  /**
   * Actualiza los detalles de las actividades
   * PUT or PATCH activities/:slug
   */
  async update ({ auth, params, request, response }) {
    //Obtenemos el id del usuario autenticado y se almacena en una nueva const id
    const { id } = auth.user
    // comprueba si el usuario autenticado creo esta actividad
    if (id === data.user_id) {
      try {
        // Busca la actividad por el slug
        const activity = await Activity.findByOrFail('slug', params.slug)
        // guarda los datos del request en una const data
        const data = request.only
        ([
        'title',
        'type',
        'date_event',
        'hour',
        'short_description',
        'description',
        'latitude',
        'longitude',
        'address',
        'neighborhood',
        'location'
        ])
        // método que solo modifica los atributos especificados.
        activity.merge(data)
        // metodo para persistir los cambios en la base de datos
        await activity.save()
        // respuesta exitosa con los datos de la actividad
        return response.status(201).json({
          status: 'success',
          data: activity
        })
      } catch (error) {
        // Si no logra actualizarse muestra un error
        if (Object.keys(error).length === 0) error=`A ocurrido un error al buscar la actividad  ${params.slug}`
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }
    } else {
      // Si no lo es muestra un error
      return response.status(400).json({
        status: 'error',
        message: 'No tiene permiso para hacer modificiones en esta actividad'
      })
    }
  }

  /**
   * Elimina una actividad por id.
   * DELETE activities/:id
   */
  async destroy ({ params, request, response }) {
  }

  /**
   * Se encarga de subir imagenes al perfil de usuario.
   * POST  activity/:slug/images
   */
  async activityImages ({params, request, response }) {

    const profile = await Profile.findByOrFail('slug', params.slug)

    const images = request.file('image', {
      types: ['image'],
      size: '3mb'
    })


    await images.moveAll(Helpers.tmpPath('uploads/activities/'), file => ({
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
      data: profile
    })
  }
}

module.exports = ActivityController
