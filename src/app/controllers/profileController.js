const Admin = require('../models/Admin')

module.exports = {
    async index(req, res) {
        const { userId: id } = req.session

        const user = await Admin.findUser({ id: id })

        if (!user) return res.render('session/login')

        return res.render('admin/view-user', { user })
    },
    async put(req, res) {
        await Admin.updateUser(req.body)

        return res.render('admin/view-user', {user: req.body})
    }
}