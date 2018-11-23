'use strict'
const Env = use('Env')
/*
 * Modelos y recursos a implementar
 */

const Activity = use('App/Models/Api/V-1/Activity')

const { validate, sanitizor } = use('Validator')

const Cloudinary = use('App/Services/CloudinaryService')

class ActivityController {

  /**
   * Muestra todas las actividades.
   * GET activities
   */
  async index ({response}) {

    const activity = await Activity.query()
          .with('images')
          .with('user.profile')
          .fetch()

    return response.status(200).json({
      status: 'success',
      data: activity
    })
  }

  /**
   * Crea y guarda una nueva actividad.
   * POST activities
   */
  async store ({ auth, request, response }) {

    //Obtenemos el id y el rol del usuario autenticado y se almacena en una nueva const
    const { id, rol } = auth.user
    // validamos que e rol corresponda a administrador
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

      data.slug = sanitizor.slug(`${data.title} ${data.address} ${date_event}`)

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
      await activity.loadMany(['user.profile', 'images','organizers.image'])
      return response.status(200).json({
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
    // comprueba si el usuario autenticado creo esta actividad
    if (id === data.user_id) {
      try {
        // método que solo modifica los atributos especificados.
        activity.merge(data)
        // metodo para persistir los cambios en la base de datos
        await activity.save()
        // respuesta exitosa con los datos de la actividad
        return response.status(200).json({
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
   * Elimina una actividad
   * DELETE activities/:slug
   */
  async destroy ({ auth, params, response }) {
    //Obtenemos el id del usuario autenticado y se almacena en una nueva const id
    const { id } = auth.user
    // Busca por el slug de la actividad
    const activity = await Activity.findByOrFail('slug', params.slug)

    if (id === activity.user_id) {
      try {

        await activity.delete()

        // respuesta exitosa
        return response.status(200).json({
          status: 'success',
          data: 'Se ha eliminado el la actividad con exito'
        })
      } catch (error) {
        // Si no logra actualizarse muestra un error
        if (Object.keys(error).length === 0) error=`A ocurrido un error al eliminar la actividad`
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }
    } else {
      // Si no lo es muestra un error
      return response.status(400).json({
        status: 'error',
        message: 'No tiene permiso para eliminar esta actividad'
      })
    }
  }

  /**
   * Se encarga de subir las imagenes de actividades.
   * El atributo en el formulario se debe llamar image[]
   * para cargar la imagen
   *
   * POST activity/:slug/images
   */
  async imageUpload ({auth, params, request, response }) {

    //Obtenemos el rol del usuario autenticado y se almacena en una nueva const
    const {rol } = auth.user
    // validamos que e rol corresponda a administrador
    if (rol === Env.get('ADMIN_TYPE')) {

      // almacena las imagenes que llegan por request
      try {

        // Busca la actividad
        const activity = await Activity.findByOrFail('slug', params.slug)

        // almacenamos las imagenes cargadas en la const fie
        const files = request.file('image')

        const imgs = []

        for (let file of files._files) {
          const cloudinaryMeta = await Cloudinary.v2.uploader.upload(
            file.tmpPath,
              {
                // Le indicamos a cloudinary que almacene la imagen en una carpeta llamada activities
                // en caso de no existir la creara
                folder: 'activities',
                width: 1200,
              }
          )
          // almacenamos la informacion de la imagen en la tabla image_activities
          imgs.push(await activity.images().create({
            cloudinary_id: cloudinaryMeta.public_id.split('/')[1],
            public_id: cloudinaryMeta.public_id,
            version: cloudinaryMeta.version,
            path: cloudinaryMeta.secure_url
          }))
        }

        // devuelve los datos de las imagenes guardadas
        return response.status(200).json({
          status: 'success',
          data:  imgs
        })
      }
      catch (error) {
        // Si no logra guardarse muestra un error
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
        message: 'No tiene permiso para subir imagenes'
      })
    }
  }

  /**
   * Se encarga de eliminar las imagenes de actividades.
   * para cargar la imagen
   *
   * DLETE activity/:slug/images/:cloudinary_id
   */
  async imageDestroy ({ auth, params, response }) {
    //Obtenemos el id y el rol del usuario autenticado y se almacena en una nueva const
    const {rol } = auth.user
    // validamos que e rol corresponda a administrador
    if (rol === Env.get('ADMIN_TYPE')) {
      try {
        // Busca la actividad
        const activity = await Activity.findByOrFail('slug', params.slug)

        // elimina la imagen por cloudinary_id en cloudinary
        await Cloudinary.v2.uploader.destroy('activities' + params.cloudinary_id)

        // elimina la imagen por cloudinary_id en la base de datos
        await activity.images()
          .where('cloudinary_id', params.cloudinary_id)
          .delete()

        const imgs = await activity.images().fetch()
        // devuelve los datos de las imagenes de la actividad almacenadas
        return response.status(200).json({
          status: 'success',
          data:  imgs
        })
      }
      catch (error) {
        // Si no logra eliminarse muestra un error
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
        message: 'No tiene permiso para subir imagenes'
      })
    }
  }
}

module.exports = ActivityController
