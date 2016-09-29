'use strict'

const Schema = use('Schema')

class ChangeSocketIdInStSocketsSchema extends Schema {

  up () {
    this.table('st_sockets', (table) => {
      // alter st_sockets table
      table.string('socket_id', 50).nullable().after("core_user_id");
    })
  }

  down () {
    this.table('st_sockets', (table) => {
      // opposite of up goes here

    })
  }

}

module.exports = ChangeSocketIdInStSocketsSchema
