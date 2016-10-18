'use strict'

const Schema = use('Schema')

class StInvitesSchema extends Schema {

  up () {
    this.create('st_invites', (table) => {
      table.increments()
      table.integer('invited_by').nullable()
      table.string('name').nullable()
      table.string('email').nullable()
      table.string('mobile').nullable()
      table.string('message').nullable()
      table.datetime('invited_at').nullable()
      table.datetime('notified_at').nullable()
      table.datetime('registered_at').nullable()
      table.integer('core_user_id').nullable()
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('st_invites')
  }

}

module.exports = StInvitesSchema
