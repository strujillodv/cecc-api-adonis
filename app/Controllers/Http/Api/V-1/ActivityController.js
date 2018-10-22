'use strict'

/**
 * Resourceful controller for interacting with activities
 */
class ActivityController {
  /**
   * Show a list of all activities.
   * GET activities
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new activity.
   * GET activities/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new activity.
   * POST activities
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single activity.
   * GET activities/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing activity.
   * GET activities/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update activity details.
   * PUT or PATCH activities/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a activity with id.
   * DELETE activities/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ActivityController
