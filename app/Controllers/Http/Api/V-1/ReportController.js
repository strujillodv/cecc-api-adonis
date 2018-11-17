'use strict'
/*
 * Modelos y recursos a implementar
 */

const Report = use('App/Models/Api/V-1/Report')

const { validate } = use('Validator')
const Mail = use('Mail')
const Cloudinary = use('App/Services/CloudinaryService')

/**
 * Resourceful controller for interacting with reports
 */
class ReportController {

  /**
   * Muestra todos los reportes.
   * GET reports
   */
  async index ({response}) {
    const report = await Report.query()
          .with('images')
          .with('user.profile')
          .with('records.user.profile')
          .fetch()
    return response.status(200).json({
      status: 'success',
      data: report
    })
  }


  /**
   * Crea/guarda un nuevo reporte
   * POST reports
   */
  async store ({ auth, request, response }) {
    //Obtenemos el id y el rol del usuario autenticado y se almacena en una nueva const
    const { id, user_name, email } = auth.user
    // Definimos reglas para validar los datos que le llegan a la api
    const rules = {
      type:       'required',
      title:      'required',
      latitude:   'required',
      longitude:  'required'
    }

    // Obtenmos la información por request y la almacenamos en la const data
    const data = request.only
    ([
      'type',
      'title',
      'description',
      'latitude',
      'longitude',
      'address',
      'neighborhood',
      'location'
    ])

    data.user_id = id
    const d = new Date()
    data.number = `${user_name.substr(0,2)}-${d.getTime().toString().substr(0,6) + data.type.substr(0,1) + ('00'+ Math.floor((Math.random() * 999) + 1)).slice(-3)}`
    data.status = 'open'

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
      const report = await Report.create(data)

      // envia un mensaje con el numero de reporte
      await Mail.send('email.report', data, (message) => {
        message.from('<noreply@cecc.co>')
        message.to(email)
        message.subject(`Reporte creado`)
      })

      // Enviamos los datos almacenados
      return response.status(201).json({
        status: 'success',
        data: report
      })

    } catch (error){
      if (Object.keys(error).length === 0) error =`A ocurrido un error al intentar generar el reporte`
      // Responde a la aplicaion si se produce un error al guardar la información
      return response.status(400).json({
        status: 'error',
        message: error
      })
    }

  }

  /**
   * Display a single report.
   * GET reports/:number
   */
  async show ({ params, response }) {
    try {
      const report = await Report.findByOrFail('number', params.number)

      await report.loadMany(['user.profile', 'images', 'records'])
      return response.status(201).json({
        status: 'success',
        data: report
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
   * Update report details.
   * PUT  report/:number
   */
  async update ({ auth, params, request, response }) {
    //Obtenemos el id del usuario autenticado y se almacena en una nueva const id
    const { id } = auth.user
    // Busca por el numero de reporte
    const report = await Report.findByOrFail('number', params.number)
    // guarda los datos del request en una const data
    const data = request.only
    ([
      'type',
      'title',
      'description',
      'latitude',
      'longitude',
      'address',
      'neighborhood',
      'location'
    ])
    // comprueba si el usuario autenticado creo esta actividad
    if (id === report.user_id) {
      try {
        // método que solo modifica los atributos especificados.
        report.merge(data)
        // metodo para persistir los cambios en la base de datos
        await report.save()
        // respuesta exitosa con los datos de la actividad
        return response.status(201).json({
          status: 'success',
          data: report
        })
      } catch (error) {
        // Si no logra actualizarse muestra un error
        if (Object.keys(error).length === 0) error=`A ocurrido un error al buscar el reporte No. ${params.number}`
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }
    } else {
      // Si no lo es muestra un error
      return response.status(400).json({
        status: 'error',
        message: 'No tiene permiso para hacer modificiones a este reporte'
      })
    }
  }

  /**
   * Delete a report with id.
   * DELETE report/:number
   */
  async destroy ({ auth, params, response }) {
    //Obtenemos el id del usuario autenticado y se almacena en una nueva const id
    const { id } = auth.user
    // Busca por el numero de reporte
    const report = await Report.findByOrFail('number', params.number)

    if (id === report.user_id) {
      try {

        await report.delete()

        // respuesta exitosa
        return response.status(200).json({
          status: 'success',
          data: 'Se ha eliminado el reporte con exito'
        })
      } catch (error) {
        // Si no logra actualizarse muestra un error
        if (Object.keys(error).length === 0) error=`A ocurrido un error al eliminar el reporte No. ${params.number}`
        return response.status(400).json({
          status: 'error',
          message: error
        })
      }
    } else {
      // Si no lo es muestra un error
      return response.status(400).json({
        status: 'error',
        message: 'No tiene permiso para eliminar este reporte'
      })
    }
  }

  /**
   * Se encarga de subir las imagenes de los reportes.
   * El atributo en el formulario se debe llamar image[]
   * para cargar la imagen
   *
   * POST report/:number/images
   */
  async imageUpload ({params, request, response }) {

    // almacena las imagenes que llegan por request
    try {

      // Busca el reporte por numero
      const report = await Report.findByOrFail('number', params.number)

      // almacenamos las imagenes cargadas en la const fie
      const files = request.file('image')

      const imgs = []

      // almacenamos las imagenes en el servicio cloudinary
      for (let file of files._files) {
        const cloudinaryMeta = await Cloudinary.v2.uploader.upload(
          file.tmpPath,
            {
              // Le indicamos a cloudinary que almacene la imagen en una carpeta llamada reports
              // en caso de no existir la creara
              folder: 'reports',
              width: 800,
            }
        )
        // almacenamos la informacion de la imagen en la tabla image_reports
        imgs.push(await report.images().create({
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
       // Si no logra ser guardada muestra un error
       if (Object.keys(error).length === 0) error=`A ocurrido un error al buscar la actividad  ${params.slug}`
       return response.status(400).json({
         status: 'error',
         message: error
       })
    }
  }

  /**
   * Se encarga de eliminar la imagene del reporte seleccionado.
   *
   * POST report/:number/images
   */
  async imageDestroy ({params, response }) {

    try {
      // Busca el reporte
      const report = await Report.findByOrFail('number', params.number)

      // elimina la imagen por cloudinary_id en cloudinary
      await Cloudinary.v2.uploader.destroy( 'reports/' + params.cloudinary_id )

      // elimina la imagen por cloudinary_id en la base de datos
      await report.images().where('cloudinary_id', params.cloudinary_id ).delete()

      const imgs = await report.images().fetch()
      // devuelve los datos de las imagenes de la actividad almacenadas
      return response.status(200).json({
        status: 'success',
        data:  imgs
      })
    }
    catch (error) {
       // Si no logra eliminarse muestra un error
       if (Object.keys(error).length === 0) error='A ocurrido un error al eliminar la imagen'
       return response.status(400).json({
         status: 'error',
         message: error
       })
    }
  }
}

module.exports = ReportController
