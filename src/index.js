const express = require("express");
const favicon = require("express-favicon");
const bodyParser = require("body-parser");
const initRouter = require("./routes");
const db = require("./db");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const doc = require("../doc.json");

db.sync();

const app = express();
app.use(cors());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(doc));

app.use(bodyParser.json());
app.use(favicon(__dirname + "/public/favicon.png"));

app.use(express.static(__dirname));

app.get("/ping", function (req, res) {
  return res.send("pong");
});

initRouter(app);

app.listen(process.env.PORT || 4000, () =>
  console.log(`server listen on port 4000`)
);
