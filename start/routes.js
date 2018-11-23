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
  // ruta para buscar si un usuario / email se encuentra registrado
  Route.post('search/:qwery', 'Auth/AuthenticationController.find')

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
  Route.put('profile/:slug/image/:id_image', 'Api/V-1/ProfileController.imageUpdate').middleware('auth')


  /*
   * Rutas para la gestion de actividades
   * Para la creación, actualización y eliminacion
   * se debe tener rol de admnistrador
   * Verbos GET, PUT, POST, DELETE
   */

  // ruta para la consulta de todas las actividades
  Route.get('activities', 'Api/V-1/ActivityController.index')
  // ruta para la consulta de una actividad
  Route.get('activity/:slug', 'Api/V-1/ActivityController.show')
  // ruta para la creacion de nuevas actividades
  Route.post('activity', 'Api/V-1/ActivityController.store').middleware('auth')
  // ruta para actualizar la información de una actividad
  Route.put('activity/:slug', 'Api/V-1/ActivityController.update').middleware('auth')
  // ruta para eliminar una actividad
  Route.delete('activity/:slug', 'Api/V-1/ActivityController.update').middleware('auth')
  // ruta para cargar imagen de actividades
  Route.post('activity/:slug/images', 'Api/V-1/ActivityController.imageUpload').middleware('auth')
  // ruta para eliminar imagenes
  Route.delete('activity/:slug/images/:cloudinary_id', 'Api/V-1/ActivityController.imageDestroy')

  /*
   * Rutas para la gestion de organizadores
   * Verbos PUT, POST, DELETE
   */

  // ruta para cargar organizadores de cada actividad
  Route.post('activity/:slug/organizers', 'Api/V-1/OrganizerController.store').middleware('auth')
  // ruta para actualizar la información de los organizadores de cada actividad
  Route.put('activity/:slug/organizers/:id', 'Api/V-1/OrganizerController.update').middleware('auth')
  // ruta para eliminar un organizador
  Route.delete('activity/:slug/organizers/:id', 'Api/V-1/OrganizerController.destroy').middleware('auth')
  // ruta para cargar imagen del organizador
  Route.post('activity/:slug/organizers/:id/image', 'Api/V-1/OrganizerController.imageUpload').middleware('auth')
  // ruta para actualizar la imagen del organizador
  Route.put('activity/:slug/organizers/:id/image', 'Api/V-1/OrganizerController.imageUpdate').middleware('auth')

  /*
   * Rutas para la gestion de reportes
   * Verbos GET, PUT, POST, DELETE
   */

  // ruta para la consulta de todos los reportes
  Route.get('reports', 'Api/V-1/ReportController.index')
  // ruta para la consulta de un reporte
  Route.get('report/:number', 'Api/V-1/ReportController.show')
  // ruta para la creacion de nuevos reportes
  Route.post('report', 'Api/V-1/ReportController.store').middleware('auth')
  // ruta para actualizar la información de un reporte
  Route.put('report/:number', 'Api/V-1/ReportController.update').middleware('auth')
  // ruta para eliminar la información de un reporte
  Route.delete('report/:number', 'Api/V-1/ReportController.destroy').middleware('auth')
  // ruta para cargar imagenes del reporte
  Route.post('report/:number/images', 'Api/V-1/ReportController.imageUpload').middleware('auth')
  // ruta para eliminar imagenes del reporte
  Route.delete('report/:number/images/:cloudinary_id', 'Api/V-1/ReportController.imageDestroy').middleware('auth')

  /*
   * Rutas para la gestion de revisiones
   * Verbos PUT, POST, DELETE
   */

  // ruta para cargar organizadores de cada actividad
  Route.post('report/:number/record', 'Api/V-1/RecordController.store').middleware('auth')
  // ruta para actualizar la información de los organizadores de cada actividad
  Route.put('report/:number/record/:id', 'Api/V-1/RecordController.update').middleware('auth')
  // ruta para eliminar un organizador
  Route.delete('report/:number/record/:id', 'Api/V-1/RecordController.destroy').middleware('auth')
  // ruta para cargar imagen del organizador

  /*
   * Rutas para la gestion de tips
   * Para la creación, actualización y eliminacion
   * se debe tener rol de admnistrador
   * Verbos GET, PUT, POST, DELETE
   */

  // ruta para la consulta de los tips
  Route.get('tips', 'Api/V-1/TipController.index')
  // ruta para la consulta de un tip aleatorio
  Route.get('findTip', 'Api/V-1/TipController.find')
  // ruta para la consulta de un tip especifico
  Route.get('tips/:slug', 'Api/V-1/TipController.show')
  // ruta para la creacion de nuevos tips
  Route.post('tips', 'Api/V-1/TipController.store').middleware('auth')
  // ruta para actualizar la información de un tip
  Route.put('tips/:slug', 'Api/V-1/TipController.update').middleware('auth')
  // ruta para eliminar un tip
  Route.delete('tips/:slug', 'Api/V-1/TipController.update').middleware('auth')
  // ruta para cargar imagen de tips
  Route.post('tips/:slug/images', 'Api/V-1/TipController.imageUpload').middleware('auth')
  // ruta para eliminar imagenes
  Route.delete('tips/:slug/images/:cloudinary_id', 'Api/V-1/TipController.imageDestroy')


}).prefix(Env.get('API_REST_NAME'))


