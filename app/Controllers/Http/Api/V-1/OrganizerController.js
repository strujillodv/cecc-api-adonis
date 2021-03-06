'use strict'
const Env = use('Env')
const Activity = use('App/Models/Api/V-1/Activity')
const Organizer = use('App/Models/Api/V-1/Organizer')

const { validate} = use('Validator')
const Cloudinary = use('App/Services/CloudinaryService')

/**
 * Resourceful controller for interacting with organizers
 */
class OrganizerController {

  /**
   * Create/save a new organizer.
   * POST activity/:slug/organizers
   */
  async store ({ auth, request, response, params}) {
    //Obtenemos el id del usuario autenticado y se almacena en una nueva const id
    const { rol } = auth.user

    if (rol === Env.get('ADMIN_TYPE')) {

      // Busca la actividad por el slug
      const activity = await Activity.findByOrFail('slug', params.slug)

      // Definimos reglas para validar los datos que le llegan a la api
      const rules = {
        name: 'required'
      }

      // Obtenmos la información por request y la almacenamos en la const data
      const data = request.only
      ([
        'name',
        'short_description',
        'link_web',
        'link_faceboock',
        'email'
      ])
      data.activity_id = activity.id

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
        const organizer = await Organizer.create(data)

        // Enviamos los datos almacenados
        return response.status(201).json({
          status: 'success',
          data: organizer
        })

      } catch (error){
        if (Object.keys(error).length === 0) error =`A ocurrido un error al intentar crear el organizador`
        // Responde a la aplicaion si se produce un error al guardar la información
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }
    } else {
      return response.status(400).json({
        status: 'error',
        message: 'No tiene autorización para crear organizadores'
      })
    }
  }


  /**
   * Update organizer details.
   * PUT or PATCH activity/:slug/organizers/:id
   */
  async update ({auth, params, request, response }) {
    //Obtenemos el id del usuario autenticado y se almacena en una nueva const id
    const { rol } = auth.user

    if (rol === Env.get('ADMIN_TYPE')) {

      // Busca la actividad por el slug
      const activity = await Activity.findByOrFail('slug', params.slug)
      // Almacenamos la información en la Base de Datos
      const organizer = await Organizer.find(params.id)

      // Obtenmos la información por request y la almacenamos en la const data
      const data = request.only
      ([
        'name',
        'link_web',
        'link_faceboock',
        'email'
      ])

      // Manejo de excepciones
      try {

        organizer.merge(data)
        // metodo para persistir los cambios en la base de datos
        await organizer.save()

        // Enviamos los datos almacenados
        return response.status(201).json({
          status: 'success',
          data: organizer
        })

      } catch (error){
        if (Object.keys(error).length === 0) error =`A ocurrido un error al intentar crear el organizador`
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
   * Delete a organizer with id.
   * DELETE activity/:slug/organizers/:id
   */
  async destroy ({auth, params, response }) {
    //Obtenemos el id del usuario autenticado y se almacena en una nueva const id
    const { rol } = auth.user
    if (rol === Env.get('ADMIN_TYPE')) {
      try {
        // Busca la actividad por el slug
        await Activity.findByOrFail('slug', params.slug)
        // Almacenamos la información en la Base de Datos
        const organizer = await Organizer.find(params.id)
        organizer.delete()

        // Enviamos los datos almacenados
        return response.status(201).json({
          status: 'success',
          data: "Organizador eliminado"
        })

      } catch (error){
        if (Object.keys(error).length === 0) error =`A ocurrido un error al eliminar el organizador`
        // Responde a la aplicaion si se produce un error al guardar la información
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }
    } else {
      return response.status(400).json({
        status: 'error',
        message: 'No tiene autorización para crear organizadores'
      })
    }
  }

  /**
   * Se encarga de subir una imagen de organizador.
   * El atributo en el formulario se debe llamar image
   * para cargar la imagen
   *
   * POST activity/:slug/organizers/:id/image
   */

  async imageUpload ({auth, params, request, response }) {

    const { rol } = auth.user
    if (rol === Env.get('ADMIN_TYPE')) {

      try {
        const organizer = await Organizer.find(params.id)

        // almacenamos la imagen cargada en la const file
        const file = request.file('image')

        // cargamos la imagen de usuario con el servicio de cloudinary
        const cloudinaryMeta = await Cloudinary.v2.uploader.upload(
          file.tmpPath,
          {
            // le asignamos como public_id el nombre del organizador
            public_id: organizer.name,
            // Le indicamos a cloudinary que almacene la imagen en una carpeta llamada organizers
            // en caso de no existir la creara
            folder: 'organizers',
            width: 320
          }
        )
        // almacenamos la informacion de la imagen almacenada en la tabla images_organizers
        const img = await organizer.image().create({
          cloudinary_id: cloudinaryMeta.public_id.split('/')[1],
          public_id: cloudinaryMeta.public_id,
          version: cloudinaryMeta.version,
          path: cloudinaryMeta.secure_url
        })
        // devuelve los datos de la imagen del organizador
        return response.status(200).json({
          status: 'success',
          data: img
        })

      } catch (error){
        if (Object.keys(error).length === 0) error =`A ocurrido un error al agregar la imagen`
        // Responde a la aplicaion si se produce un error al guardar la información
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }
    } else {
      return response.status(400).json({
        status: 'error',
        message: 'No tiene autorización para subir imagenes a este organizador'
      })
    }
  }

  /**
   * Se encarga de actualizar la imagen del organizador.
   * El atributo en el formulario se debe llamar image
   * para cargar la imagen
   * PUT activity/:slug/organizers/:id/image
   */
  async imageUpdate ({auth, params, request, response }) {

    const { rol } = auth.user
    if (rol === Env.get('ADMIN_TYPE')) {
      try {

        const organizer = await Organizer.find(params.id)

        // almacenamos la imagen cargada en la const file
        const file = request.file('image')

        // cargamos la imagen de usuario con el servicio de cloudinary
        const cloudinaryMeta = await Cloudinary.v2.uploader.upload(
          file.tmpPath,
          {
            // le asignamos como public_id el nombre del organizador
            public_id: organizer.name,
            // Le indicamos a cloudinary que almacene la imagen en una carpeta llamada organizers
            // en caso de no existir la creara
            folder: 'organizers',
            width: 320
          }
        )
        // almacenamos la informacion de la imagen almacenada en la tabla images_organizers
        const img = await organizer.image().where('public_id', cloudinaryMeta.public_id).update({
          public_id: cloudinaryMeta.public_id,
          version: cloudinaryMeta.version,
          path: cloudinaryMeta.secure_url
        })
        // devuelve los datos de la imagen del organizador
        return response.status(200).json({
          status: 'success',
          data: img
        })

      } catch (error){
        if (Object.keys(error).length === 0) error =`A ocurrido un error al actualizar la imagen`
        // Responde a la aplicaion si se produce un error al guardar la información
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }
    } else {
      return response.status(400).json({
        status: 'error',
        message: 'No tiene autorización para subir imagenes a este organizador'
      })
    }
  }
}

module.exports = OrganizerController
