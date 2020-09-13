const db = require("../../config/db")
const { hash } = require('bcryptjs')

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
    selectRecipesByUser(id) {
        return db.query(`
            SELECT DISTINCT ON (recipe_id) recipe_files.*, recipes.title, chefs.name AS author, files.path
            FROM recipe_files
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            LEFT JOIN recipes ON (recipe_files.recipe_id = recipes.id)
            AND (recipes.user_id = $1)
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        `, [id])
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
            user_id,
            title,
            ingredients,
            preparation,
            information
        ) VALUES ( (
          SELECT id FROM chefs 
          WHERE chefs.name = $1  
        ) , $2, $3, $4, $5, $6)
            RETURNING id`

        const values = [
            data.author,
            data.id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
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
        return db.query(`
            SELECT chefs.*, files.path
            FROM chefs
            LEFT JOIN files ON (files.id = chefs.file_id)`)
    },
    createChef(data) {
        const query = `INSERT INTO chefs (
            name,
            file_id
        ) VALUES ($1, $2)
        RETURNING id`

        const values = [
            data.name,
            data.file_id
        ]

        return db.query(query, values)
    },
    async findChef(id) {

        const chef = await db.query(`
            SELECT
                chefs.id,
                chefs.name,
                files.path
            FROM
                chefs
            LEFT JOIN files ON (files.id = chefs.file_id)
            WHERE chefs.id = $1
        `, [id])

        const chef_recipes = await db.query(`
            SELECT
                DISTINCT ON (recipe_files.recipe_id) recipe_id,
                chefs.id AS chef_id,
            recipes.title,
            files.path
            FROM
                chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN files ON (files.id = recipe_files.file_id)
            WHERE
                chefs.id = $1
            ORDER BY
                recipe_files.recipe_id
        `, [id])

        return {chef, chef_recipes}
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
    },

    // ========= USERS =========

    selectAllUsers() {
        return db.query('SELECT * FROM users')
    },
    async findUser(filter) {
        const key = Object.keys(filter)[0]
        const value = filter[key]
        
        const results = await db.query(`SELECT * FROM users WHERE ${key} = '${value}'`)
        
        return results.rows[0]
    },
    async createUser(data) {
        
        try {
            let query = `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    ${data.admin ? 'is_admin,' : ''}
                    reset_token,
                    reset_token_expires
                ) VALUES ($1, $2, $3, $4, $5 ${data.admin ? ', $6' : ''})
                RETURNING id
            `

            const passwordHash = await hash(data.password, 8)
    
            let values = [
                data.name,
                data.email,
                passwordHash,
                // não esquecer de alterar os 3 abaixo
                data.reset_token || 1,
                data.reset_token_expires || 1,
            ]

            if (data.admin) {
                values = [
                    data.name,
                    data.email,
                    passwordHash,
                    data.admin,
                    // não esquecer de alterar os 3 abaixo
                    data.reset_token || 1,
                    data.reset_token_expires || 1,
                ]
            }
    
            const results = await db.query(query, values)
    
            return results.rows[0].id
            
        } catch (err) {
            console.error(err)
        }
    },
    async updateUser(data) {
        const query = `
            UPDATE users SET
                name=$1,
                email=$2,
                is_admin=$3
            WHERE id = $4`
        
        const values = [
            data.name,
            data.email,
            data.admin,
            data.id
        ]

        await db.query(query, values)
        return
    },
    async updateToken(id, fields) {

        let query = 'UPDATE users SET'

        Object.keys(fields).map((key, index, array) => {
            if ((index + 1) < array.length) {
                query = `${query} ${key} = '${fields[key]}', `
            } else {
                query = `${query} ${key} = '${fields[key]}'
                WHERE id = ${id} `
            }
        })

        await db.query(query)
        return
    },
    async deleteUser(id) {
        await db.query(`DELETE FROM users WHERE id = $1`, [id])

        return
    }
}