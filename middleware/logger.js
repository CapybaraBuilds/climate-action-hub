const logger = (req, res, next) => {
    const start = new Date()

    res.on('finish', ()=>{
        const now = new Date()
        const duration = now - start;
        const formatedNow = now.toISOString().replace('T',' ').slice(0,19)
        console.log(`${formatedNow} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`)
    })

    next()
}

module.exports = logger