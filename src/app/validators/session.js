const Admin = require('../models/Admin')
const { compare } = require('bcryptjs')

async function login(req, res, next) {

    const { email, password } = req.body
    
    const user = await Admin.findUser({ email: email })
    
    if (!user) return res.render('session/login', {
        user: req.body,
        error: 'Usuário não cadastrado!'
    })

    const passed = await compare(password, user.password)
    
    if (!passed) return res.render('session/login', {
        user: req.body,
        error: 'Senha incorreta.'
    })

    req.user = user

    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await Admin.findUser({ email: email })

        if (!user) return res.render('session/forgot-password', {
            user: req.body,
            error: 'Email não cadastrado!'
        })

        req.user = user

        next()

    } catch (err) {
        console.error(err)
    }
}

async function reset(req, res, next) {
    // procurar usuário
    const { email, password, token, repeatPassword } = req.body

    const user = await Admin.findUser({ email: email })

    if (!user) return res.render('session/reset-password', {
        user: req.body,
        token,
        error: 'Usuário não cadastrado!'
    })

    // ver se senha bate
    if (password != repeatPassword) return res.render('session/reset-password', {
        user: req.body,
        error: 'Senha e repetição de senha incorretas.'
    })

    // ver se token bate
    if (token != user.reset_token) return res.render('session/reset-password', {
        user: req.body,
        token,
        error: 'Token inválido! Solicite uma nova recuperação de senha.'
    })

    // ver se token não expirou
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('session/reset-password', {
        user: req.body,
        token,
        error: 'Token expirado! Por favor, solicite uma nova recuperação de senha.'
    })

    req.user = user

    next()
}

module.exports = {
    login,
    forgot,
    reset
}