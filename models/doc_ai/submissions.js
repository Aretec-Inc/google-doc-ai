'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes, schema) => {
    class Submission extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Submission.init(
        {
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            submission_name: DataTypes.STRING,
            processor_id: DataTypes.STRING,
            processor_name: DataTypes.STRING,
            aggregate_score: DataTypes.FLOAT,
            user_id: DataTypes.STRING,
            status: DataTypes.STRING,
            created_at: {
                type: DataTypes.DATE
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: `${schema}_submissions`,
            tableName: 'submissions',
            schema,
            createdAt: false,
            updatedAt: false
        });
    return Submission;
};