const Admin = require('../models/Admin')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)
        
    for (key of keys) {
        if (body[key] == '' && key != 'admin') {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }
        }
    }
}

async function show(req, res, next) {
    const { userId: id } = req.session

    const user = await Admin.findUser({ id: id })

    if (!user) return res.render('admin/login', {
        error: 'Usuário não encontrado!'
    })

    req.user = user

    next()
}

async function post(req, res, next) {

    // ========== Checar se todos os campos estão preenchidos
    const fieldsNotFilled = checkAllFields(req.body)
    if (fieldsNotFilled) return res.send(fieldsNotFilled)

    // ========== Checar se o usuário já existe
    const user = await Admin.findUser({ email: req.body.email})
    
    if (user) return res.send({
        user: req.body,
        error: 'Usuário já cadastrado.'
    })

    next()
}

async function update(req, res, next) {

    // ========== Checar se todos os campos estão preenchidos
    const fieldsNotFilled = checkAllFields(req.body)
    if (fieldsNotFilled) return res.render('admin/view-user', fieldsNotFilled)

    // ========== Checar se a senha fornecida está correta
    const { password, id } = req.body

    const user = await Admin.findUser({id: id})

    const passed = await compare(password, user.password)

    if (!passed) return res.render('admin/view-user',{
        user: req.body,
        error: 'Senha incorreta. Por favor, tente novamente.'
    })
    
    next()
}

module.exports = {
    show,
    post,
    update
}