import express from "express";
import {apiRouter} from "./api";
import {startEventStore} from "./eventStore";
import cookieParser from "cookie-parser";
import {v4 as uuid} from 'uuid';

startEventStore()

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
    if (!req.cookies['schnoin.token']) {
        res.cookie('schnoin.token', uuid(), {
            path: '/',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
    }
    next()
})

app.use('/api', apiRouter)

if (process.env.NODE_ENV === "production") {
    app.use(express.static('dist'))
} else {
    const Bundler = require("parcel-bundler")
    const bundler = new Bundler('src/client/index.html', {})
    app.use(bundler.middleware())
}

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log("App is running on port " + port)
})
