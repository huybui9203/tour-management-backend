require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/connectDB')
const route = require('./routes')

const app = express()
const port = process.env.PORT || 6969

app.use(cors())
app.use(express.json());
app.use(express.urlencoded());

connectDB()

route(app)
app.get('/status', (req, res) => {
    res.json({
        message: 'successfull'
    })
})


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})