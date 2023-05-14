'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes, schema) => {
  class PdfPages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PdfPages.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    file_name: {
      type: DataTypes.STRING
    },
    dimensions: DataTypes.STRING,
    pageNumber: DataTypes.INTEGER,
    paragraphs: 'CHARACTER VARYING(1000000)'
  }, {
    sequelize,
    modelName: `${schema}_pdf_pages`,
    tableName: 'pdf_pages',
    schema,
    createdAt: false,
    updatedAt: false
  });
  return PdfPages;
};