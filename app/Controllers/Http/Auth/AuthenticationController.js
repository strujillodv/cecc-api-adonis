'use strict'

// Llamamos al modelo User
const User = use('App/Models/User')

// LLamamos al Metodo Validador de AdonisJs
const { validateAll } = use('Validator')

// Clase para el manejo de la autenticación y creación de usuarios
class AuthenticationController {

  /*
   * Metodo para registrar usuarios
   */
  async register ({ request, auth, response }) {

    // Definimos reglas para validar los datos que le llegan a la api
    const rules = {
      user_name: 'alpha_numeric|required|unique:users,user_name|min:4|max:20',
      email: 'required|email|unique:users,email',
      password: 'required|confirmed'
    }

    // En la constante validation comparamos los datos que llegan en la request con las reglas definidas
    // para evitar errores en la informacion que se almacenara en la bases de datos
    const validation = await validateAll(request.all(), rules)

    // Comprobamos si falla la validación
    if (validation.fails()) {
      // Muestra un error 400 y el error que ocurrio
      return response.status(400).json(validation.messages())
    }

    // Si la validación no contiene errores crea el nuevo usuario
    // Almacenamos la información que llega por request en la constante data
    const data = request.only(['user_name','email', 'password'])

    // Manejo de exepciones
    try {

      // Crea el nuevo usuario
      const user = await User.create(data)
      // Genera un token para el nuevo usuario
      const token = await auth.generate(user)
      // Responde a la aplicaion con msj 201 de ceración de usuario correcta y el token generado
      return response.status(201).json({
        status: 'success',
        data: token
      })

    } catch (error) {
      // Responde a la aplicaion si se produce un erro al crear un usuario
      return response.status(400).json({
        status: 'error',
        message: 'Ha ocurrido un error al intentar crear el usuario, ', error
      })
    }
  }

  /*
   * Metodo para autenticarse en la Api-Rest
   */
  async login ({ request, auth, response }) {

    // Almacenamos la información que llega por request
    const { email, password } = request.only(['email', 'password'])

    // Manejo de excepciones
    try {
      //Genera un token con los datos enviados desde la aplicación
      const token = await auth.attempt(email, password)

      // Retorna una respuesta exitosa con el token del usuario
      return response.status(200).json({
        status: 'success',
        data: token
      })
    } catch (error) {
      // En caso de fallar la autenticación devuelve el error que se presento
      response.status(400).json({
        status: 'error',
        message: error
      })
    }
  }

  async me ({ auth, response}) {

    return response.json({
      status: 'success',
      data: auth.user
    })
  }

  async showuser ({ response}) {

    const user = await User.find(1)

    await user.loadMany(['profile.information','profile.image'])

    return response.json({
      status: 'success',
      data: user
    })
  }
}

module.exports = AuthenticationController
