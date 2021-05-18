const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const config = require("./config")
const app = require("./app")

async function start(){
try {
  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  app.listen(config.APP_PORT, () => { console.log(`Server is running on port ${config.APP_PORT}`)})
} catch(e){
    console.log(e)
  }
}
start()