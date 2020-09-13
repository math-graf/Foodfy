const User = require('../models/User')
const Admin = require('../models/Admin')

module.exports = {
    async index(req, res) {
        const results = await User.selectFeatured()
        const recipes = results.rows

        return res.render('user/index', { recipes })
    },
    about(req, res) {
        return res.render('user/about')
    },
    async recipes(req, res) {
        let {page, limit, filter} = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit*(page - 1)

        const params = {
            page,
            limit,
            filter,
            offset
        }
        const results = await User.paginate(params)
        const recipes = results.rows
        let pagination

        if (recipes.length == 0) {
            pagination = {
                total: 0,
                page
            }
        } else {
            pagination = {
                total: Math.ceil(recipes[0].total/limit),
                page
            }
        }

        return res.render('user/recipes', { recipes, pagination, filter })
    },
    async chefs(req, res) {
        const results = await Admin.selectAllChefs()
        const chefs = results.rows

        return res.render('user/chefs', { chefs })
    },
    async showChef(req, res) {
        const results = await Admin.findChef(req.params.id)
        const chef = results.chef.rows[0]
        const chef_recipes = results.chef_recipes.rows

        return res.render('user/view-chef', { chef, chef_recipes })
    },
    async show(req, res) {
        const results = await User.find(req.params.id)
        const recipe = results.rows[0]
        const recipePhotos = results.rows

        return res.render('user/view-recipe', { recipe, recipePhotos })
    },
    async search(req, res) {
        let {page, limit, filter} = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit*(page - 1)

        const params = {
            page,
            limit,
            filter,
            offset,
        }

        const results = await User.paginate(params)
        const recipes = results.rows

        let pagination = {
        total: 1,
            page
        }
        if (recipes.length >= 1) {
            pagination = {
                total: Math.ceil(recipes[0].total/limit),
                page
            }
        }
        return res.render('user/search-recipes', { recipes, pagination, filter })
    }
}