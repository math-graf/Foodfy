const User = require('../models/User')

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
    chefs(req, res) {
        return res.render('user/chefs')
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