'use strict'
const Env = use('Env')
// Llamamos al modelo User
const User = use('App/Models/User')

// LLamamos al Metodo Validador de AdonisJs
const { validate } = use('Validator')
const Mail = use('Mail')

// Clase para el manejo de la autenticación y creación de usuarios
class AuthenticationController {

  async find ({ params, response, request }) {
    const data = request.only(['value'])
    try {
      if (params.qwery === 'user_name' || params.qwery === 'email') {
        const user = await User.findByOrFail(params.qwery, data.value)
        return response.status(200).json({
          status: 'sucess',
          data: `El ${params.qwery} ${data.value} si esta registrado`
        })
      } else {
        return response.status(400).json({
          status: 'error',
          data: `Se presento un error al realizar la consulta verifique el dato que intenta buscar`
        })
      }

    } catch (e) {
      return response.status(200).json({
        status: 'error',
        data: `El ${params.qwery} ${data.value} no esta registrado`
      })
    }

  }

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
    const validation = await validate(request.all(), rules)

    // Comprobamos si falla la validación
    if (validation.fails()) {
      // Muestra un error 400 y los errores que ocurrieron
      return response.status(400).json(validation.messages())
    }

    // Si la validación no contiene errores crea el nuevo usuario
    // Almacenamos la información que llega por request en la constante data
    const data = request.only(['user_name','email', 'password', 'rol'])

    if (data.rol != Env.get('ADMIN_TYPE')) data.rol = 'user_cecc'

    // Manejo de exepciones
    try {

      // Crea el nuevo usuario
      const user = await User.create(data)
      // Genera un token para el nuevo usuario
      const token = await auth.generate(user)

      // envia un mensaje de bienvenida
      await Mail.send('email.welcome', data, (message) => {
        message.from('<noreply@cecc.co>')
        message.to(user.email)
        message.subject(`Bienvenido ${user.user_name}`)
      })

      // Responde a la aplicaion con msj 201 de ceeación de usuario correcta y el token generado
      return response.status(201).json({
        status: 'success',
        data: token
      })

    } catch (error) {
      // Responde a la aplicaion si se produce un error al crear un usuario
      return response.status(400).json({
        status: 'error',
        message: 'Ha ocurrido un error al intentar crear el usuario, ', error
      })
    }
  }

  /*
   * Metodo para eliminar un usuario
   */

  async destroy ({ request, auth, response }) {

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

  async show ({ auth, response}) {

    const { id } = auth.user

    const user = await User.find(id)

    await user.load('profile.image')
    // await user.load('reports')
    await user.load('records')

    return response.json({
      status: 'success',
      data: user
    })
  }
}

module.exports = AuthenticationController
