'use strict'

/**
 * Resourceful controller for interacting with organizers
 */
class OrganizerController {
  /**
   * Show a list of all organizers.
   * GET organizers
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new organizer.
   * GET organizers/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new organizer.
   * POST organizers
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single organizer.
   * GET organizers/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing organizer.
   * GET organizers/:id/edit
   */
  async edit ({ params, request, response, view }) {
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
