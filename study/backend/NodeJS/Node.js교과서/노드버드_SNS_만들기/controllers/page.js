exports.renderProfile = (req, res, next) => {
    // 서비스를 호출
    res.render('profile', { title: '내 정보 - NodeBird' });
};
exports.renderJoin = (req, res, next) => {
    res.render('join', { title: '회원가입 - NodeBird' });
};
exports.renderMain = (req, res, next) => {
    res.render('main', {
        title: 'NodeBird',
        twits: [],
    });
};

// 라우터 -> 컨트롤러 -> 서비스