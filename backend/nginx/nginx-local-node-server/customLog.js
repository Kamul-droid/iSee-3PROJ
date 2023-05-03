module.exports = (str) => {
    const date = new Date() 
    console.log(`${date.toISOString()} ${str}`)
}