const Sequelize = require('sequelize'); // Sequelize 라이브러리를 불러옵니다.

class User extends Sequelize.Model { // User 모델을 정의합니다.
    static initiate(sequelize) { // 모델을 초기화하는 메서드입니다.
        User.init({ // User 모델의 속성을 정의합니다.
            email: { // 이메일 속성
                type: Sequelize.STRING(40), // 문자열 타입, 최대 길이 40
                allowNull: true, // null 허용
                unique: true, // 고유 값이어야 함
            },
            nick: {
                type: Sequelize.STRING(15), // 문자열 타입, 최대 길이 15
                allowNull: false, // null 허용
            },
            password: {
                type: Sequelize.STRING(100), // 문자열 타입, 최대 길이 100
                allowNull: true, // null 허용
            }
            , provider: {
                type: Sequelize.ENUM('local', 'kakao'), // ENUM 타입, 'local' 또는 'kakao' 값만 허용
                allowNull: false, // null 허용
                defaultValue: 'local', // 기본값은 'local'
            },
            snsId: {
                type: Sequelize.STRING(30), // 문자열 타입, 최대 길이 30
                allowNull: true, // null 허용
            }
        }, {
            sequelize,
            timestamps: true, // createdAt과 updatedAt 컬럼을 자동으로 추가
            underscored: false, // 컬럼 이름을 camelCase로 유지 (false이면 snake_case로 변환)
            modelName: 'User', // 모델 이름
            tableName: 'users', // 테이블 이름
            paranoid: true, // deletedAt 컬럼을 추가하여 soft delete 기능 활성화
            charset: 'utf8', // 문자셋 설정
            collate: 'utf8_general_ci', // 문자 정렬 설정
        })
    }

    static associate(db) { // 다른 모델과의 관계를 정의하는 메서드입니다.
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, { // 팔로워
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow'
        })
        db.User.belongsToMany(db.User, { // 팔로잉
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow'
        })
    }
}

module.exports = User; // User 모델을 외부에서 사용할 수 있도록 내보냅니다.