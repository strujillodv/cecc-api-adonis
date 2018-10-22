'use strict'

/**
 * Resourceful controller for interacting with reports
 */
class ReportController {
  /**
   * Show a list of all reports.
   * GET reports
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new report.
   * GET reports/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new report.
   * POST reports
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single report.
   * GET reports/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing report.
   * GET reports/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update report details.
   * PUT or PATCH reports/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a report with id.
   * DELETE reports/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ReportController
