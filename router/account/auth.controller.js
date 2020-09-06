const Joi = require('joi');
const Account = require('../../models/account');

exports.localRegister = async (req, res) => {
    const schema = Joi.object().keys({
        Name: Joi.string().required(),
        email: Joi.string().email().required(),
        ID: Joi.string().required(),
        password: Joi.string().required().min(6)
    });

    const result = schema.validate(req.body);

    if(result.error){
        res.status = 400;
        return;
    }
    //TODO: 아이디 / 이메일 중복처리 구현

    let account = null;
    try {
        account = await Account.localRegister(req.body);
    } catch(e) {
        res.status(500).json({"에러" : "전자", error: e.toString() });
    }


    let token = null;
    try {
        token = await account.generateToken();
        res.cookie('access_token', token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7});
    } catch(e) {
        res.status(500).json({"에러" : "후자" ,error: e.toString()});
    }
     res.send("회원가입 완료");


}

// //로컬 로그인
// exports.localLogin = async (ctx) => {
//     const schema = Joi.object().keys({
//         email: Joi.string().email().required(),
//         password: Joi.string().required()
//     });
    
//     const result = schema.validate(ctx.request.body);

//     if(result.error){
//         ctx.status = 400;
//         return;
//     }

//     const { email, password } = ctx.request.body;

//     let account = null;

//     try{
//         account = await Account.findByEmail(email);
//     } catch(e){
//         ctx.throw(500, e);
//     }


//     if(!account || !account.validatePassword(password)){
//         ctx.status = 403;
//         return;
//     }

//     let token = null;
//     try {
//         token = await account.generateToken();
//     } catch(e) {
//         ctx.throw(500, e);
//     }

//     ctx.cookies.set('access_token', token, {httpOnly : true, maxAge: 1000 * 60 * 60 * 24 * 7})

//     ctx.body = account.profile;
// };