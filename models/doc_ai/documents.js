'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes, schema) => {
  class documents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  documents.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    template_id: DataTypes.STRING,
    file_name: DataTypes.STRING,
    user_id: DataTypes.STRING,
    file_type: DataTypes.STRING,
    file_address: DataTypes.STRING,
    original_file_name: DataTypes.STRING,
    file_size: DataTypes.STRING,
    is_validate: DataTypes.BOOLEAN,
    md5: DataTypes.STRING,
    is_deleted: DataTypes.BOOLEAN,
    is_verified: DataTypes.BOOLEAN,
    is_completed: DataTypes.BOOLEAN,
    error: DataTypes.STRING,
    original_file_address: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: `${schema}_documents`,
    tableName: 'documents',
    schema,
    createdAt: false,
    updatedAt: false
  });
  return documents;
};