'use strict'
const Env = use('Env')
/*
 * Modelos y recursos a implementar
 */

const Tip = use('App/Models/Api/V-1/Tip')

const { validate, sanitizor } = use('Validator')

const Cloudinary = use('App/Services/CloudinaryService')

/**
 * Resourceful controller for interacting with tips
 */
class TipController {
  /**
   * Muestra uno de los tips aleatoreamente.
   * GET tip
   */
  async index ({ response }) {

    const tip = await Tip.query()
          .with('images')
          .with('user.profile')
          .fetch()

    return response.status(200).json({
      status: 'success',
      data: tip
    })
  }

  /**
   * Crea un nuevo tip.
   * POST tips
   */
  async store ({ auth, request, response }) {
    //Obtenemos el id y el rol del usuario autenticado y se almacena en una nueva const
    const { id, rol } = auth.user
    // validamos que e rol corresponda a administrador
    if (rol === Env.get('ADMIN_TYPE')) {
      // Definimos reglas para validar los datos que le llegan a la api
      const rules = {
        title: 'required',
        description: 'required',
        slug: 'unique:tips,slug'
      }

      // Obtenmos la información por request y la almacenamos en la const data
      const data = request.only
      ([
        'type',
        'title',
        'description'
      ])

      data.user_id = id

      data.slug = sanitizor.slug(`${data.title}-${('0'+ Math.floor((Math.random() * 99) + 1)).slice(-2)}`)

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
        const tip = await Tip.create(data)

        // Enviamos los datos almacenados
        return response.status(201).json({
          status: 'success',
          data: tip
        })

      } catch (error){
        if (Object.keys(error).length === 0) error =`A ocurrido un error al intentar crear el tip`
        // Responde a la aplicaion si se produce un error al guardar la información
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }
    } else {
      return response.status(400).json({
        status: 'error',
        message: 'No tiene autorización para crear tips'
      })
    }
  }

  /**
   * Muestra un tip
   * GET tips/:slug
   */
  async show ({ params, response }) {
    try {
      const tip = await Tip.findByOrFail('slug', params.slug)
      await tip.load('images')
      return response.status(200).json({
        status: 'success',
        data: tip
      })
    }
    catch (error) {
      if (Object.keys(error).length === 0) error=`A ocurrido un error al buscar el tip ${params.slug}`
      return response.status(400).json({
        status: 'error',
        message: error,
      })
    }
  }

  /**
   * actualiza un tip
   * PUT tips/:slug
   */
  async update ({ auth, params, request, response }) {
    //Obtenemos el id y el rol del usuario autenticado y se almacena en una nueva const
    const {  rol } = auth.user
    // validamos que e rol corresponda a administrador
    if (rol === Env.get('ADMIN_TYPE')) {

      // Busca la actividad por el slug
      const tip = await Tip.findByOrFail('slug', params.slug)

      // Obtenmos la información por request y la almacenamos en la const data
      const data = request.only
      ([
        'type',
        'description'
      ])

      // Manejo de excepciones
      try {

        tip.merge(data)
        // Almacenamos la información en la Base de Datos
        await tip.save()

        // Enviamos los datos almacenados
        return response.status(200).json({
          status: 'success',
          data: tip
        })

      } catch (error){
        if (Object.keys(error).length === 0) error =`A ocurrido un error al intentar crear el tip`
        // Responde a la aplicaion si se produce un error al guardar la información
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }
    } else {
      return response.status(400).json({
        status: 'error',
        message: 'No tiene autorización para crear tips'
      })
    }
  }

  /**
   * Elimina un tip.
   * DELETE tips/:id
   */
  async destroy ({ auth, params, response }) {
    //Obtenemos el id del usuario autenticado y se almacena en una nueva const id
    const { id } = auth.user
    // Busca por el slug del tip
    const tip = await Tip.findByOrFail('slug', params.slug)

    if (id === tip.user_id) {
      try {

        await tip.delete()

        // respuesta exitosa
        return response.status(200).json({
          status: 'success',
          data: 'Se ha eliminado el tip con exito'
        })
      } catch (error) {
        // Si no logra actualizarse muestra un error
        if (Object.keys(error).length === 0) error=`A ocurrido un error al eliminar el tip`
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
   * POST tips/:slug/images
   */
  async imageUpload ({ auth, params, request, response }) {

    //Obtenemos el rol del usuario autenticado y se almacena en una nueva const
    const { rol } = auth.user
    // validamos que e rol corresponda a administrador
    if (rol === Env.get('ADMIN_TYPE')) {

      // almacena las imagenes que llegan por request
      try {

        // Busca la actividad
        const tip = await Tip.findByOrFail('slug', params.slug)

        // almacenamos las imagenes cargadas en la const fie
        const files = request.file('image')

        const imgs = []

        for (let file of files._files) {
          const cloudinaryMeta = await Cloudinary.v2.uploader.upload(
            file.tmpPath,
              {
                // Le indicamos a cloudinary que almacene la imagen en una carpeta llamada tips
                // en caso de no existir la creara
                folder: 'tips',
                width: 900,
              }
          )
          // almacenamos la informacion de la imagen en la tabla image_tips
          imgs.push(await tip.images().create({
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
        if (Object.keys(error).length === 0) error=`A ocurrido un error al buscar el tip  ${params.slug}`
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
   * DLETE tips/:slug/images/:cloudinary_id
   */
  async imageDestroy ({ params, response }) {
    try {
      // Busca la actividad
      const tip = await Tip.findByOrFail('slug', params.slug)

      // elimina la imagen por cloudinary_id en cloudinary
      await Cloudinary.v2.uploader.destroy('tips/' + params.cloudinary_id)

      // elimina la imagen por cloudinary_id en la base de datos
      await tip.images().where('cloudinary_id', params.cloudinary_id).delete()

      const imgs = await tip.images().fetch()
      // devuelve los datos de las imagenes de los tips almacenadas
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
  }
}

module.exports = TipController
