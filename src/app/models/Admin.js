const db = require("../../config/db")
const { date } = require('../../lib/functions')

module.exports = {

    // ====== RECIPES =========

    selectAllRecipes() {
        return db.query(`
            SELECT DISTINCT ON (recipe_id) recipe_files.*, recipes.title, chefs.name AS author, files.path
            FROM recipe_files
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        `)
    },
    find(id) {
        return db.query(`
            SELECT recipes.*, recipe_files.file_id, files.path
            FROM recipes
            LEFT JOIN recipe_files 
            ON (recipes.id = recipe_files.recipe_id)
            LEFT JOIN files 
            ON (recipe_files.file_id = files.id)
            WHERE recipes.id = $1
        `, [id])
        
        // return db.query(`SELECT * FROM recipes
        // WHERE id = $1`, [id])
    },
    createRecipe(data) {
        const query = `INSERT INTO recipes (
            chef_id,
            title,
            ingredients,
            preparation,
            information,
            created_at
        ) VALUES ( (
          SELECT id FROM chefs 
          WHERE chefs.name = $1  
        ) , $2, $3, $4, $5, $6)
            RETURNING id`

        const values = [
            data.author,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]
    
        return db.query(query, values)
    },
    editRecipe(id) {
        return db.query(`  
            SELECT recipes.*, chefs.name, recipe_files.file_id, files.path
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN files ON (files.id = recipe_files.file_id)
            WHERE recipes.id = $1
        `, [id])
    },
    updateRecipe(data) {
        const query = `UPDATE recipes SET
            chef_id = ( SELECT id FROM chefs WHERE chefs.name = $1 ),
            title = $2,
            ingredients = $3,
            preparation = $4,
            information = $5
        WHERE id = $6`
        
        const values = [
            data.author,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values)
    },
    deleteRecipe(id) {
        return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },

    // ========= CHEFS =========

    selectAllChefs() {
        return db.query(`SELECT * FROM chefs`)
    },
    createChef(data) {
        const query = `INSERT INTO chefs (
            name,
            file_id,
            created_at
        ) VALUES ($1, $2, $3)
        RETURNING id`

        const values = [
            data.name,
            data.file_id,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },
    findChef(id) {
        return db.query(`SELECT chefs.*, recipes.title, files.path, recipe_files.recipe_id, recipe_files.file_id
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
        LEFT JOIN files ON (files.id = recipe_files.file_id OR files.id = chefs.file_id)
        WHERE chefs.id = $1`, [id])
    },
    inputChef(id) {
        return db.query(`SELECT *, (SELECT count(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS total_recipes FROM chefs WHERE id = $1`, [id])
    },
    updateChef(data) {
        const query = `UPDATE chefs SET
            avatar_url = $1,
            name = $2
        WHERE id = $3`

        const values = [
            data.avatar_url,
            data.name,
            data.id
        ]

        return db.query(query, values)
    },
    removeChef(id) {
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    }
}