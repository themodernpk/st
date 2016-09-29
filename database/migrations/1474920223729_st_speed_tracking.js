'use strict'

const Schema = use('Schema')

class StSpeedTrackingSchema extends Schema {

  up () {
    this.create('st_speed_tracking', (table) => {
      table.increments()
      table.integer('core_user_id').nullable()
      table.decimal('lat', 11, 8).nullable()
      table.decimal('lng', 11, 8).nullable()
      table.float('speed', 8, 2).nullable()
      table.string('unit', 11, 8).nullable()
      table.integer('created_by').nullable()
      table.integer('updated_by').nullable()
      table.integer('deleted_by').nullable()
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('st_speed_tracking')
  }

}

module.exports = StSpeedTrackingSchema
