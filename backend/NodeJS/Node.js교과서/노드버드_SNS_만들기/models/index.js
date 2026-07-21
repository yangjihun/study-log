const Sequelize = require('sequelize'); // Sequelize 라이브러리를 불러옵니다.
const fs = require('fs'); // 파일 시스템 모듈을 불러옵니다.
const path = require('path'); // 경로 모듈을 불러옵니다.
const env = process.env.NODE_ENV || 'development'; // 환경 변수를 가져옵니다. (없으면 'development'로 설정)
const config = require('../config/config')[env]; // config/config.js 파일에서 환경에 맞는 설정을 가져옵니다.
const db = {}; // db 객체를 생성합니다.
const sequelize = new Sequelize( // Sequelize 인스턴스를 생성합니다.
  config.database, config.username, config.password, config,
);
db.sequelize = sequelize; // Sequelize 인스턴스를 db 객체에 추가합니다.

const basename = path.basename(__filename); // 현재 파일의 이름을 가져옵니다.
fs.readdirSync(__dirname) // 현재 디렉토리의 파일들을 읽어옵니다.
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'; // 숨김 파일이 아니고, 현재 파일이 아니며, .js 확장자를 가진 파일만 필터링합니다.
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    console.log(file, model.name);
    db[model.name] = model;
    model.initiate(sequelize);
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
})

module.exports = db; // db 객체를 외부에서 사용할 수 있도록 내보냅니다.