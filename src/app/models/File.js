const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({filename, recipe_id}) {
        const query = `
            WITH rows AS (
                INSERT INTO files (
                    name,
                    path
                ) VALUES ($1, $2)
                RETURNING id
            )
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($3, (SELECT id FROM rows))
        `

        const values = [
            filename,
            `/images/${filename}`,
            recipe_id,            
        ]

        return db.query(query, values)
    },
    createChef(filename) {
        const values = [
            filename,
            `/images/${filename}`
        ]

        return db.query(`
        INSERT INTO files (
            name,
            path
        ) VALUES ($1, $2)
        RETURNING id`, values)
    },
    async delete(id) {
        
        try {
            const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = results.rows[0]

            fs.unlinkSync('public' + file.path)  
        
            return db.query(`
                DELETE FROM files WHERE id = $1
            `, [id])

        } catch (err) {
            console.error(err)
        }
    },
    async deleteAllFiles(id) {
        try {
            const results = await db.query(`
                SELECT recipes.id, recipe_files.file_id, files.path
                FROM recipes
                LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
                LEFT JOIN files ON (files.id = recipe_files.file_id)
                WHERe recipes.id = $1`, [id])
            const files = results.rows
            
            const filesPromise = files.map(file => {
                db.query(`DELETE FROM files WHERE id = $1`, [file.file_id])
                fs.unlinkSync('public' + file.path) 
            })
            await Promise.all(filesPromise)

            return

        } catch (err) {
            console.error(err)
        }
    },
    async deleteChef(id) {

        try {
            const results = await db.query(`
                SELECT chefs.id, files.path
                FROM chefs
                LEFT JOIN files ON (chefs.file_id = files.id)
                WHERE chefs.id = $1`, [id])
            const file = results.rows[0]
    
            fs.unlinkSync('public' + file.path) 
    
            return

        } catch (err) {
            console.error(err)
        }
    }
}