'use strict'
const Env = use('Env')
const Route = use('Route')

// Ruta que redireciona a la raiz de la api-rest
Route.get('/', ({ response }) => {
  response.redirect(Env.get('API_REST_NAME'))
})

/*
 * Rutas para la viusalizar las imagenes
 * Verbos GET
 */

Route.get('images/profiles/:path', 'ImageController.profiles')

Route.group(() => {

  // Ruta de bienvenida en la api rest
  Route.get('/', ({ response }) => {
    return response.status(400).json({
      repositorio: 'https://github.com/strujillodv/cecc-api-adonis',
      documentacion: 'https://documenter.getpostman.com/view/233252/RWgwRvv2'
    })
  })

  /*
   * Rutas para la autenticación
   * Verbos GET, POST
   */

  // ruta para autenticar los usuarios
  Route.post('login', 'Auth/AuthenticationController.login')
  // ruta para registrar los usuarios
  Route.post('register', 'Auth/AuthenticationController.register')
  // ruta para mostrar la información del usuario autenticado
  Route.get('show', 'Auth/AuthenticationController.show').middleware(['auth'])

  /*
   * Rutas para la gestion de perfil de usuarios
   * Verbos GET, PUT, POST
   */

  // rutas para la gestion de perfiles de usuario
  Route.post('profile', 'Api/V-1/ProfileController.store').middleware('auth')
  // ruta para la consulta de perfil por el valor del campo slug en la tabla profiles
  Route.get('profile/:slug', 'Api/V-1/ProfileController.show').middleware('auth')
  // ruta para la consulta de perfil por el valor del campo slug en la tabla profiles
  Route.put('profile/:slug', 'Api/V-1/ProfileController.update').middleware('auth')
  // ruta para cargar imagenes en el perfil de usuario
  Route.post('profile/:slug/images', 'Api/V-1/ProfileController.profileImages').middleware('auth')


  /*
   * Rutas para la gestion de actividades
   * Verbos GET, PUT, POST
   */

  // ruta para la cnsulta de todas las actividades
  Route.get('activity', 'Api/V-1/ActivityController.index')
  // ruta para la creacion de nuevas actividades
  Route.post('activity', 'Api/V-1/ActivityController.store').middleware('auth')
  // ruta para la consulta de perfil por el valor del campo slug en la tabla actividades
  Route.get('activity/:slug', 'Api/V-1/ActivityController.show').middleware('auth')
  // ruta para la consulta de perfil por el valor del campo slug en la tabla actividades
  Route.put('activity/:slug', 'Api/V-1/ActivityController.update').middleware('auth')
  // ruta para cargar imagenes en el perfil de usuario
  Route.post('activity/:slug/images', 'Api/V-1/ActivityController.activityImages').middleware('auth')

}).prefix(Env.get('API_REST_NAME'))
