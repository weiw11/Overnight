require('dotenv').config();
const mongoose = require("mongoose");

const CONN_STRING = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority`

main().catch(err => console.log(err));

async function main() {
  mongoose.connect(CONN_STRING, {useNewUrlParser: true, useUnifiedTopology: true});
}