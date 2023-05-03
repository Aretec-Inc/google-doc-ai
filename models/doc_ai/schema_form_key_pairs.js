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
    file_name: DataTypes.STRING,
    field_name: DataTypes.STRING,
    field_value: DataTypes.STRING,
    time_stamp: DataTypes.STRING,
    validated_field_name: DataTypes.STRING,
    validated_field_value: DataTypes.STRING,
    updated_date: DataTypes.DATE,
    confidence: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    key_x1: DataTypes.FLOAT,
    key_x2: DataTypes.FLOAT,
    key_y1: DataTypes.FLOAT,
    key_y2: DataTypes.FLOAT,
    value_x1: DataTypes.FLOAT,
    value_x2: DataTypes.FLOAT,
    value_y1: DataTypes.FLOAT,
    value_y2: DataTypes.FLOAT,
    page_number: DataTypes.INTEGER,
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    type: DataTypes.STRING,
    field_name_confidence: DataTypes.STRING,
    field_value_confidence: DataTypes.STRING,
    dlp_info_type: DataTypes.STRING,
    dlp_match_likelihood: DataTypes.STRING,
    nullable: DataTypes.BOOLEAN,
    data_types: DataTypes.STRING,
    column_name: DataTypes.STRING,
    width: DataTypes.STRING,
    height: DataTypes.STRING,
    w: DataTypes.FLOAT,
    h: DataTypes.FLOAT,
    name_width: DataTypes.FLOAT,
    name_height: DataTypes.FLOAT,
    value_width: DataTypes.FLOAT,
    value_height: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: `${schema}_schema_form_key_pairs`,
    tableName: 'schema_form_key_pairs',
    schema,
    createdAt: false,
    updatedAt: false
  });
  return SchemaFormKeyPairs;
};