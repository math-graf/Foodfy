const db = require('../../config/db')

module.exports = {
    selectFeatured() {
        return db.query(`
            SELECT DISTINCT ON (recipe_id) recipe_files.*, recipes.title, chefs.name AS author, files.path
            FROM recipe_files
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        `)
    },
    selectAll() {
        return db.query(`
            SELECT DISTINCT ON (recipe_id) recipe_files.*, recipes.title, chefs.name AS author, files.path
            FROM recipe_files
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        `)
    },
    find(id) {
        return db.query(`SELECT recipes.*, recipe_files.file_id, files.path
        FROM recipes
        LEFT JOIN recipe_files 
        ON (recipes.id = recipe_files.recipe_id)
        LEFT JOIN files 
        ON (recipe_files.file_id = files.id)
        WHERE recipes.id = $1`, [id])
    },
    findBy(filter, callback) {
        db.query(`SELECT recipes.*, chefs.name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'`, function(err, results) {
            if (err) throw `Database error!${err}`
            
            callback(results.rows)
        })
    },
    paginate(params) {
        const {filter, limit, offset} = params

        let query = ''
            filterQuery = ''
            totalQuery = `(SELECT count(*) FROM recipes) AS total`
        
        if (filter) {
            filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`
            totalQuery = `(SELECT count(*) FROM recipes ${filterQuery}) AS total`
        }

        query = `
            SELECT DISTINCT ON (recipe_id) recipe_files.*, recipes.title, chefs.name AS author, files.path, ${totalQuery}
            FROM recipe_files
            LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            ${filterQuery}
            LIMIT $1
            OFFSET $2
        `
        return db.query(query, [limit, offset])
    }
}