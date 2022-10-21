const echo = (msg: string) => {
    console.log(msg)
}

export default echo;

const sleepy = () => new Promise(resolve => {
    let count = 0
    const id = setInterval(() => {
        console.log("test")

        if (count++ > 5) {
            clearInterval(id)
            resolve(null)
        }
    }, 500)
})


const testTarget = {
    echo,
    thisEcho(test: string) {
        this.echo(test)
    }
}

export { testTarget, echo, sleepy }