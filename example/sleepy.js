const { clear } = require("console")

module.exports = () => {
    return new Promise((resolve) => {
        let count = 0
        const id = setInterval(() => {
            console.log("test")

            if (count++ > 5) {
                clearInterval(id)
                resolve()
            }
        }, 500)
    })
}