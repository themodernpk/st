'use strict'

const Schema = use('Schema')

class StSocketsSchema extends Schema {

  up () {
    this.create('st_sockets', (table) => {
      table.increments()
      table.integer('core_user_id').nullable()
      table.string('socket_id', 50).nullable()
      table.integer('created_by').nullable()
      table.integer('updated_by').nullable()
      table.integer('deleted_by').nullable()
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('st_sockets')
  }

}

module.exports = StSocketsSchema
