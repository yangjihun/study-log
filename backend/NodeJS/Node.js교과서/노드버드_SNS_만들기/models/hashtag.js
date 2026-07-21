const Sequelize = require('sequelize');

class Hashtag extends Sequelize.Model {
    static initiate(sequelize) {
        Hashtag.init({
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci', // 이모티콘 저장
        });
    }

    static associate(db) {
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    }
}

module.exports = Hashtag;