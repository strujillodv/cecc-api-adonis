'use strict'

/**
 * Resourceful controller for interacting with tips
 */
class TipController {
  /**
   * Show a list of all tips.
   * GET tips
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new tip.
   * GET tips/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new tip.
   * POST tips
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single tip.
   * GET tips/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing tip.
   * GET tips/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update tip details.
   * PUT or PATCH tips/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a tip with id.
   * DELETE tips/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = TipController
