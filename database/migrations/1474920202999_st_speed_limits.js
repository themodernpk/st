'use strict'

const Schema = use('Schema')

class StSpeedLimitsSchema extends Schema {

  up () {
    this.create('st_speed_limits', (table) => {
      table.increments()
      table.integer('core_user_id').nullable()
      table.integer('allocated_by').nullable()
      table.dateTime('allocated_at').nullable()
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
    this.drop('st_speed_limits')
  }

}

module.exports = StSpeedLimitsSchema
