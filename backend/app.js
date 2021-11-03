const express = require("express");
const cors = require("cors");
const app = express();
const api = require('./api/location.api');
require('./api/db.connection');

app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Cross Origin for Angular Application.
app.use(cors());

// Campsite API
app.use('/api/locations', api);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});