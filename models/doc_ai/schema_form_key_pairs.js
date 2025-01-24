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
    file_name: DataTypes.STRING(1000),
    field_name: DataTypes.STRING(500),
    field_value: DataTypes.STRING(4000),
    time_stamp: DataTypes.STRING(50),
    validated_field_name: DataTypes.STRING(500),
    validated_field_value: DataTypes.STRING(4000),
    updated_date: DataTypes.DATE,
    confidence: DataTypes.STRING(50),
    updated_by: DataTypes.STRING(100),
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
      type: DataTypes.STRING(100)
    },
    type: DataTypes.STRING(50),
    field_name_confidence: DataTypes.STRING(50),
    field_value_confidence: DataTypes.STRING(50),
    dlp_info_type: DataTypes.STRING(100),
    dlp_match_likelihood: DataTypes.STRING(50),
    nullable: DataTypes.BOOLEAN,
    data_types: DataTypes.STRING(100),
    column_name: DataTypes.STRING(200),
    width: DataTypes.STRING(50),
    height: DataTypes.STRING(50),
    w: DataTypes.FLOAT,
    h: DataTypes.FLOAT,
    name_width: DataTypes.FLOAT,
    name_height: DataTypes.FLOAT,
    value_width: DataTypes.FLOAT,
    value_height: DataTypes.FLOAT,
    expected_value: DataTypes.STRING(2000),
    potential_issue: DataTypes.STRING(5000),
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