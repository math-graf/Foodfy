const db = require("../../config/db")
const { date } = require('../../lib/functions')

module.exports = {

    // ====== RECIPES =========

    selectAllRecipes(callback) {
        db.query(`SELECT * FROM recipes`, function(err, results) {
            if (err) return `Database error!${err}`

            callback(results.rows)
        })
    },
    find(id, callback) {
        db.query(`SELECT * FROM recipes
        WHERE id = $1`, [id], function(err, results) {
            if (err) throw `Database error!${err}`

            callback(results.rows[0])
        })
    },
    createRecipe(data, callback) {
        const query = `INSERT INTO recipes (
            chef_id,
            image,
            title,
            ingredients,
            preparation,
            information,
            created_at
        ) VALUES ( (
          SELECT id FROM chefs 
          WHERE chefs.name = $1  
        ) , $2, $3, $4, $5, $6, $7)
            RETURNING id`

        const values = [
            data.author,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]
    
        db.query(query, values, function(err, results) {
            if (err) throw `Database error!${err}`

            callback(results.rows[0])
        })
    },
    editRecipe(id, callback) {
        db.query(`SELECT recipes.*, chefs.name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id], function(err, results) {
            if (err) throw `Database error!${err}`
            
            callback(results.rows[0])
        })
    },
    updateRecipe(data, callback) {
        const query = `UPDATE recipes SET
            chef_id = ( SELECT id FROM chefs WHERE chefs.name = $1 ),
            image = $2,
            title = $3,
            ingredients = $4,
            preparation = $5,
            information = $6
        WHERE id = $7`
        
        const values = [
            data.author,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if (err) throw `Database error!${err}`
            
            callback()
        })
    },
    deleteRecipe(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results) {
            if (err) throw `Database error!${err}`

            callback()
        })
    },

    // ========= CHEFS =========

    selectAllChefs(callback) {
        db.query(`SELECT * FROM chefs`, function(err, results) {
            if (err) throw `Database error!${err}`

            callback(results.rows)
        })
    },
    createChef(data, callback) {
        const query = `INSERT INTO chefs (
            name,
            avatar_url,
            created_at
        ) VALUES ($1, $2, $3)
        RETURNING id`

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, results) {
            if (err) throw `Database error!${err}`

            callback(results.rows[0])
        })
    },
    findChef(id, callback) {
        db.query(`SELECT chefs.*, chefs.id AS chefid, recipes.*, recipes.id AS recipe_id
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        ORDER BY chefs.id`, function(err, results) {
            if (err) throw `Database error!${err}`

            const filteredResults = results.rows.filter(function(chef) {
                return chef.chefid == id
            })
            callback(filteredResults)
        })
    },
    inputChef(id, callback) {
        db.query(`SELECT *, (SELECT count(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS total_recipes FROM chefs WHERE id = $1`, [id], function(err, results) {
            if (err) throw `Database error!${err}`

            callback(results.rows[0])
        })
    },
    updateChef(data, callback) {
        const query = `UPDATE chefs SET
            avatar_url = $1,
            name = $2
        WHERE id = $3`

        const values = [
            data.avatar_url,
            data.name,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if (err) throw `Database error!${err}`

            callback()
        })
    },
    removeChef(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err, results) {
            if (err) throw `Database error!${err}`

            callback()
        })
    }
}