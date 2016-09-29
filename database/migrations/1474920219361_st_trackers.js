'use strict'

const Schema = use('Schema')

class StTrackersSchema extends Schema {

  up () {
    this.create('st_trackers', (table) => {
      table.increments()
      table.integer('core_user_id').nullable()
      table.integer('tracker_user_id').nullable()
      table.string('status').nullable()
      table.integer('created_by').nullable()
      table.integer('updated_by').nullable()
      table.integer('deleted_by').nullable()
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('st_trackers')
  }

}

module.exports = StTrackersSchema
