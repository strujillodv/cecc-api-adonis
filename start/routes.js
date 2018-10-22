'use strict'

const Route = use('Route')
const nameApi = 'api/v1'

Route.group(() => {
  // ruta para autenticar los usuarios
  Route.post('login', 'Auth/AuthenticationController.login')
  // ruta para registrar los usuarios
  Route.post('register', 'Auth/AuthenticationController.register')
  // ruta para mostrar la información del usuario autenticado
  Route.get('show', 'Auth/AuthenticationController.show').middleware(['auth'])
  // rutas para la gestion de perfiles de usuario
  Route.resource('profile', 'Api/V-1/ProfileController')
    .apiOnly().except(['index', 'create','edit'])
    .middleware('auth')
  // ruta para cargar imagenes en el perfil de usuario
  Route.post('profiles/:slug/images', 'Api/V-1/ProfileController.storeImage').middleware('auth')

}).prefix(nameApi)

Route.get('images/:path', 'ImageController.show')

