'use strict'
const Env = use('Env')
const Activity = use('App/Models/Api/V-1/Activity')
const Organizer = use('App/Models/Api/V-1/Organizer')

const { validate} = use('Validator')

/**
 * Resourceful controller for interacting with organizers
 */
class OrganizerController {

  /**
   * Create/save a new organizer.
   * POST organizers
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
        message: 'No tiene autorización para crear actividades'
      })
    }
  }


  /**
   * Update organizer details.
   * PUT or PATCH organizers/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a organizer with id.
   * DELETE organizers/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = OrganizerController
