'use strict'

const Schema = use('Schema')

class StUserSettingsSchema extends Schema {

  up () {
    this.create('st_user_settings', (table) => {
      table.increments()
      table.string('core_user_id').nullable()
      table.string('key').nullable()
      table.string('label').nullable()
      table.string('value').nullable()
      table.integer('created_by').nullable()
      table.integer('updated_by').nullable()
      table.integer('deleted_by').nullable()
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('st_user_settings')
  }

}

module.exports = StUserSettingsSchema
