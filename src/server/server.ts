import express from "express";
import {apiRouter} from "./api";
import {startEventStore} from "./eventStore";

startEventStore()

const app = express()
app.use(express.json())

app.use('/api', apiRouter)

if (process.env.NODE_ENV === "production") {
    app.use(express.static('dist'))
} else {
    const Bundler = require("parcel-bundler")
    const bundler = new Bundler('src/client/index.html', {})
    app.use(bundler.middleware())
}

// Listen on port 8080
app.listen(8080)
