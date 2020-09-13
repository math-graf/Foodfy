module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)

        const year = date.getFullYear()
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)

    return {
        iso: `${year}-${month}-${day}`
    }
    },
    randomize() {
        let randomPassword = ''

        for (let i = 0; i < 8; i++) {
            randomPassword = randomPassword + (Math.floor(Math.random()*10)).toString()
        }
        return randomPassword
    }
}