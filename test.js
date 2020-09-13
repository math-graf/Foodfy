const admin = null



let query = `
    INSERT INTO users (
        name,
        email,
        password,
        reset_token,
        ${admin ? 'is_admin,' : ''}
        reset_token_expires
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
`

console.log(query)