const Admin = require('../models/Admin')
const mailer = require('../../lib/mailer')
const functions = require('../../lib/functions')

module.exports = {
    async list(req, res) {
        const results = await Admin.selectAllUsers()
        const users = results.rows

        return res.render('admin/users', { users })
    },
    create(req, res) {
        return res.render('admin/register')
    },
    async post(req, res) {
        const password = functions.randomize()

        req.body = {...req.body, password}

        const userId = await Admin.createUser(req.body)
        
        // Enviar senha de acesso para o usuário
        await mailer.sendMail({
            to: req.body.email,
            from: 'no-reply@foodfy.com.br',
            subject: 'Dados de Acesso',
            html: `
                <h2>Dados de acesso à sessão de usuários Foodfy</h2>
                <p>Utilize a senha abaixo para acessar sua página de usuário:</p>
                <p>SENHA: <strong>${password}</strong></p>
            `
        })

        req.session.userId = userId
        
        return res.redirect(`/admin/profile`)
    },
    async edit(req, res) {
        const user = await Admin.findUser({id: req.params.id})
        
        return res.render('admin/edit-user', { user })
    },
    async put(req, res) {
        await Admin.updateUser(req.body)
        
        return res.render(`/admin/users/edit/${req.body.id}`, {
            success: 'Conta atualizada com sucesso!'
        })
    },
    async delete(req, res) {
        try {
            const user = await Admin.findUser({id: req.body.id})

            if (user.is_admin) return res.render('admin/users', {
                error: 'Você não pode deletar uma conta de administrador.'
            })

            await Admin.deleteUser(req.body.id)

            return res.render('admin/users', {
                success: 'Conta deletada com sucesso!'                
            })

        } catch (err) {
            console.error(err)
            return res.render('admin/users', {
                error: 'Falha ao tentar deletar a conta.'
            })
        }
    }
}