import Bundler from "parcel-bundler";
import express from "express";
import {apiRouter} from "./api";
import {startEventStore} from "./eventStore";

startEventStore()

const app = express()
app.use(express.json())

const bundler = new Bundler('src/client/index.html', {})

app.use('/api', apiRouter)

// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(bundler.middleware())


// Listen on port 8080
app.listen(8080)
