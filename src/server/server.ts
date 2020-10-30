import Bundler from "parcel-bundler";
import express from "express";
import {apiRouter} from "./api";

const app = express();

const bundler = new Bundler('src/client/index.html', {});

app.use('/api', apiRouter);

// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(bundler.middleware());


// Listen on port 8080
app.listen(8080);
