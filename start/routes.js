'use strict'
const Env = use('Env')
const Route = use('Route')

// Ruta que redireciona a la raiz de la api-rest
Route.get('/', ({ response }) => {
  response.redirect(Env.get('API_REST_NAME'))
})

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
  // ruta para la consulta de un perfil por el valor del campo slug en la tabla profiles
  Route.get('profile/:slug', 'Api/V-1/ProfileController.show').middleware('auth')
  // ruta para actualizar de perfil por el valor del campo slug en la tabla profiles
  Route.put('profile/:slug', 'Api/V-1/ProfileController.update').middleware('auth')
  // ruta para cargar imagen de perfil de usuario
  Route.post('profile/:slug/image', 'Api/V-1/ProfileController.imageUpload').middleware('auth')
  // ruta para actualizar la imagen de perfil
  Route.put('profile/:slug/image', 'Api/V-1/ProfileController.imageUpdate').middleware('auth')


  /*
   * Rutas para la gestion de actividades
   * Verbos GET, PUT, POST, DELETE
   */

  // ruta para la consulta de todas las actividades
  Route.get('activities', 'Api/V-1/ActivityController.index')
  // ruta para la creacion de nuevas actividades
  Route.post('activity', 'Api/V-1/ActivityController.store').middleware('auth')
  // ruta para la consulta de una actividad por el valor del campo slug en la tabla actividades
  Route.get('activity/:slug', 'Api/V-1/ActivityController.show').middleware('auth')
  // ruta para actualizar la información de una actividad por el valor del campo slug en la tabla actividades
  Route.put('activity/:slug', 'Api/V-1/ActivityController.update').middleware('auth')
  // ruta para cargar imagen de actividades
  Route.post('activity/:slug/images', 'Api/V-1/ActivityController.imageUpload').middleware('auth')
  // ruta para eliminar imagenes
  Route.delete('activity/:slug/images/:public_id', 'Api/V-1/ActivityController.imageDestroy')

  /*
   * Rutas para la gestion de organizadores
   * Verbos GET, PUT, POST, DELETE
   */

  // ruta para cargar organizadores de cada actividad
  Route.post('activity/:slug/organizers', 'Api/V-1/OrganizerController.store').middleware('auth')
  // ruta para actualizar la información de los organizadores de cada actividad
  Route.put('activity/:slug_activity/organizers/:id_organizer', 'Api/V-1/OrganizerController.update').middleware('auth')
  // ruta para eliminar un organizador
  Route.delete('activity/:slug_activity/organizers/:id_organizer', 'Api/V-1/OrganizerController.destroy').middleware('auth')
  // ruta para cargar imagen del organizador
  Route.post('activity/:slug_activity/organizers/:id_organizer/image', 'Api/V-1/OrganizerController.imageUpload').middleware('auth')
  // ruta para actualizar la imagen del organizador
  Route.put('activity/:slug_activity/organizers/:id_organizer/image', 'Api/V-1/OrganizerController.imageUpdate').middleware('auth')

  /*
   * Rutas para la gestion de reportes
   * Verbos GET, PUT, POST, DELETE
   */

}).prefix(Env.get('API_REST_NAME'))


