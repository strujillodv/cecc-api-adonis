'use strict'

const Route = use('Route')
const nameApi = 'api/v1'

Route.group(() => {
  Route.post('login', 'Auth/AuthenticationController.login')
  Route.post('register', 'Auth/AuthenticationController.register')
  Route.get('me', 'Auth/AuthenticationController.me').middleware(['auth'])
  Route.get('show', 'Auth/AuthenticationController.showuser').middleware(['auth'])

  Route.resource('profile', 'Profile/ProfileController').apiOnly().middleware('auth')
  Route.post('profile/:slug/images', 'Profile/ProfileController.storeImage').middleware('auth')

}).prefix(nameApi)

Route.get('images/:path', 'ImageController.show')

