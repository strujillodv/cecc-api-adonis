'use strict'

/**
 * Resourceful controller for interacting with histories
 */
class HistoryController {
  /**
   * Show a list of all histories.
   * GET histories
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new history.
   * GET histories/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new history.
   * POST histories
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single history.
   * GET histories/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing history.
   * GET histories/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update history details.
   * PUT or PATCH histories/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a history with id.
   * DELETE histories/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = HistoryController
