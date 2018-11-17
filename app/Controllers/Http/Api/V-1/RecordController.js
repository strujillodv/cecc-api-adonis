'use strict'
/*
 * Modelos y recursos a implementar
 */

const Report = use('App/Models/Api/V-1/Report')
const Record = use('App/Models/Api/V-1/Record')

const { validate } = use('Validator')
const Mail = use('Mail')

/**
 * Resourceful controller for interacting with records
 */
class RecordController {

  /**
   * Crea guarda una nueva revición.
   * POST report/:number/record
   */
  async store ({auth, params, request, response }) {

    const {id} = auth.user

    // Busca el report
    const report = await Report.findByOrFail('number', params.number)

    // Definimos reglas para validar los datos que le llegan a la api
    const rules = {
      title: 'required',
      description: 'required'
    }

    // Obtenmos la información por request y la almacenamos en la const data
    const data = request.only
    ([
      'title',
      'description'
    ])
    data.report_id = report.id
    data.user_id = id

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
      const record = await Record.create(data)

      // Enviamos los datos almacenados
      return response.status(201).json({
        status: 'success',
        data: record
      })

    } catch (error){
      if (Object.keys(error).length === 0) error =`A ocurrido un error al intentar crear el organizador`
      // Responde a la aplicaion si se produce un error al guardar la información
      return response.status(400).json({
        status: 'error',
        message: error
      })
    }
  }

  /**
   * Update record details.
   * PUT or PATCH records/:id
   */
  async update ({ params, request, response }) {

    // Busca el reporte
    const record = await Record.find(params.id)

    // Obtenmos la información por request y la almacenamos en la const data
    const data = request.only
    ([
      'title',
      'description'
    ])

    // Manejo de excepciones
    try {

      record.merge(data)
      await record.save(data)

      // Enviamos los datos almacenados
      return response.status(201).json({
        status: 'success',
        data: record
      })

    } catch (error){
      if (Object.keys(error).length === 0) error =`A ocurrido un error al intentar crear el organizador`
      // Responde a la aplicaion si se produce un error al guardar la información
      return response.status(400).json({
        status: 'error',
        message: error
      })
    }
  }

  /**
   * Delete a record with id.
   * DELETE records/:id
   */
  async destroy ({ params, request, response }) {
    // Busca el reporte
    const record = await Record.find(params.id)
    // Manejo de excepciones
    try {

      await record.delete()

      // Enviamos los datos almacenados
      return response.status(201).json({
        status: 'success',
        data: 'Se elimino satisfactoriamente la revisión'
      })

    } catch (error){
      if (Object.keys(error).length === 0) error =`A ocurrido un error al intentar crear el organizador`
      // Responde a la aplicaion si se produce un error al guardar la información
      return response.status(400).json({
        status: 'error',
        message: error
      })
    }
  }
}

module.exports = RecordController
