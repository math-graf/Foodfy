const Admin = require("../models/Admin")
const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')

module.exports = {
    loginForm(req, res) {
        return res.render('session/login')
    },
    async login(req, res) {
        req.session.userId = req.user.id

        const user = await Admin.findUser({ id: req.session.userId })
        console.log(user)
        if (!user.is_admin) {
            console.log('user is not an admin')
            return res.render('admin/view-user', { user })
        }
        console.log('user is admin')
        return res.redirect('/admin/users')
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/admin/users')
    },
    forgotForm(req, res) {
        return res.render('session/forgot-password')
    },
    async forgot(req, res) {
        const user = req.user

        try {
            const token = crypto.randomBytes(20).toString('hex')

            let now = new Date()
            now = now.setHours(now.getHours() + 1)
            
            await Admin.updateToken(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de Senha',
                html: `<h2>Perdeu a chave?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha.</p>
                <p>
                    <a href="http://localhost:5000/admin/reset-password?token=${token}" target="_blank">RECUPERAR SENHA</a>
                </p>
                `
            })

            return res.render('session/forgot-password', {
                success: 'Verifique seu email para resetar sua senha!'
            })

        } catch (err) {

            console.error(err)
            return res.render('session/forgot-password', {
                error: 'Erro inesperado. Tente novamente.'
            })
        }
    },
    resetForm(req, res) {
        return res.render('session/reset-password', { token: req.query.token })
    },
    async reset(req, res) {
        const user = req.user
        const { password, token } = req.body

        try {
            // criar novo hash de senha
            const newPassword = await hash(password, 8)

            // atualiza o usuário
            await Admin.updateToken(user.id, {
                password: newPassword,
                reset_token: '',
                reset_token_expires: ''
            })

            // avisa o usuário que a nova senha foi criada
            return res.render('session/login', {
                user: req.body,
                success: 'Senha atualizada! Faça seu login.'
            })

        } catch (err) {
            console.error(err)
            return res.render('session/reset-password', {
                user: req.body,
                token,
                error: 'Erro inesperado, tente novamente!'
            })
        }
    }
}