'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes, schema) => {
    class Document extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
        Document.init(
            {
                file_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                   
                },
                case_no: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                },
                submission_id: DataTypes.STRING,
                document_name: DataTypes.STRING,
                document_type: DataTypes.STRING,
                manager_id: DataTypes.STRING,
                status: DataTypes.STRING,
                priority: DataTypes.STRING,
                case_status:{ 
                    type:DataTypes.STRING,
                    defaultValue: 'New'
                },
                case_category: DataTypes.STRING,
                notes: DataTypes.STRING(2000),
                category_confidence: DataTypes.FLOAT,
                adjudicate_status:{ 
                    type:DataTypes.STRING,
                    defaultValue: 'Requires Review'
                },
                is_open: DataTypes.BOOLEAN,
                created_at: {
                    type: DataTypes.DATE
                },
                updated_at: {
                    type: DataTypes.DATE
                },
                is_deleted: DataTypes.BOOLEAN
            },
            {
                sequelize,
                modelName: `${schema}_documents`,
                tableName: 'documents',
                schema,
                createdAt: false,
                updatedAt: false
            });
    return Document;
};