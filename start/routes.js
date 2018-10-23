'use strict'

const Route = use('Route')

Route.group(() => {
  // ruta para autenticar los usuarios
  Route.post('login', 'Auth/AuthenticationController.login')
  // ruta para registrar los usuarios
  Route.post('register', 'Auth/AuthenticationController.register')
  // ruta para mostrar la información del usuario autenticado
  Route.get('show', 'Auth/AuthenticationController.show').middleware(['auth'])
  // rutas para la gestion de perfiles de usuario
  Route.resource('profile', 'Api/V-1/ProfileController')
    .apiOnly().only(['update','store'])
    .middleware('auth')
    // ruta para la consulta de perfil por el valor del campo slug en la tabla profiles
  Route.get('profile/:slug', 'Api/V-1/ProfileController.show').middleware('auth')
  // ruta para cargar imagenes en el perfil de usuario
  Route.post('profiles/:slug/images', 'Api/V-1/ProfileController.storeImage').middleware('auth')

}).prefix('api/v1')

Route.get('images/:path', 'ImageController.show')

Route.get('/', ({ response }) => {
  return response.status(400).json('Informacion de la api en: https://github.com/strujillodv/cecc-api-adonis')
})
