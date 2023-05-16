'use strict';
const {
  Model, DataTypes
} = require('sequelize');

DataTypes.FLOAT
module.exports = (sequelize, DataTypes, schema) => {
  class SchemaFormKeyPairs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SchemaFormKeyPairs.init({
    file_name: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    processor_name: DataTypes.STRING,
    processor_id: DataTypes.STRING,
    all_fields: DataTypes.JSONB,
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: `${schema}_export_table`,
    tableName: 'export_table',
    schema,
    createdAt: false,
    updatedAt: false
  });
  return SchemaFormKeyPairs;
};