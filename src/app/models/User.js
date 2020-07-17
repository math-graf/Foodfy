const db = require('../../config/db')

module.exports = {
    selectFeatured(callback) {
        db.query(`SELECT recipes.*, chefs.name FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`, function(err, results) {
            if (err) throw `Database error!${err}`

            callback(results.rows)
        })
    },
    selectAll(callback) {
        db.query(`SELECT recipes.*, chefs.name FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`, function(err, results) {
            if (err) throw `Database error!${err}`

            callback(results.rows)
        })
    },
    find(id, callback) {
        console.log(id)

        db.query(`SELECT recipes.*, chefs.name FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id], function(err, results) {
            if (err) throw `Database error!${err}`

            callback(results.rows[0])
        })
    },
    findBy(filter, callback) {
        db.query(`SELECT recipes.*, chefs.name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'`, function(err, results) {
            if (err) throw `Database error!${err}`
            console.log(results.rows)
            callback(results.rows)
        })
    },
    paginate(params) {
        const {filter, limit, offset, callback} = params

        let query = ''
            filterQuery = ''
            totalQuery = `(SELECT count(*) FROM recipes) AS total`
        
        if (filter) {
            filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`
            totalQuery = `(SELECT count(*) FROM recipes ${filterQuery}) AS total`
        }

        query = `SELECT recipes.*, chefs.name, ${totalQuery}
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ${filterQuery}
        LIMIT $1
        OFFSET $2`

        db.query(query, [limit, offset], function(err, results) {
            if (err) throw `Database error!${err}`
            
            callback(results.rows)
        })
    }
}