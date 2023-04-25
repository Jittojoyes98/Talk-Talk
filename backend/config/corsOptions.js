const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: "https://talk-talk.onrender.com/",
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions 