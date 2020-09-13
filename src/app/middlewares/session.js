const Admin = require("../models/Admin")

function onlyUsers(req, res, next) {
    if (!req.session.userId) return res.redirect('/admin/login')

    next()
}

async function onlyAdmins(req, res, next) {
    if (!req.session.userId) return res.redirect('/admin/login')
    
    const user = await Admin.findUser({id: req.session.userId})
        
    if (!user.is_admin) return res.redirect('/admin/profile')
    
    next()
}

async function redirectIfLogged(req, res, next) {
    if (req.session.userId) {
        const user = await Admin.findUser({id: req.session.userId})
        
        if (user.is_admin) {
            return res.redirect('/admin/users')
        } else { 
            return res.redirect('/admin/profile')
        }
    }

    next()
}

module.exports = {
    onlyUsers,
    onlyAdmins,
    redirectIfLogged
}