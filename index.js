const express = require('express');

const cookieParser = require('cookie-parser')
const path = require('path')
const { connectToMongoose } = require('./connection');
const URL = require('./models/url')
const { checkForAuthentication, restrictTo } = require('./middlewares/auth')

const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')

const app = express()
const PORT = 8000

connectToMongoose('mongodb://localhost:27017/short-url')
    .then(() => { console.log("mongodb connected") })

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthentication)

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))


app.use('/url', restrictTo(["NORMAL", "ADMIN"]), urlRoute)
app.use('/user', userRoute)
app.use('/', staticRoute)

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId
    const entry = await URL.findOneAndUpdate({
        shortId,
    }, {
        $push: {
            visitHistory: { timestamp: Date.now() }
        }
    }
    )
    res.redirect(entry.redirectUrl)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})