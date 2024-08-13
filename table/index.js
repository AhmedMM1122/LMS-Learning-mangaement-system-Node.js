// ==================== INITIALIZE EXPRESS APP ====================
const express = require("express");
const app = express();

// ====================  GLOBAL MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // TO ACCESS URL FORM ENCODED
app.use(express.static("upload"));
const cors = require("cors");
app.use(cors()); // ALLOW HTTP REQUESTS LOCAL HOSTS

// ====================  Required Module ====================
const reg = require("./routes/Reg");
const course = require("./routes/Course");
const instructormg =  require("./routes/instructormg");
const assign = require("./routes/assign");
const studentassign = require("./routes/registercourse");
const instructorfun = require("./routes/instructorfun")
// ====================  RUN THE APP  ====================
app.listen(4000, "localhost", () => {
  console.log("SERVER IS RUNNING ");
});

// ====================  API ROUTES [ ENDPOINTS ]  ====================
app.use("/Reg", reg);
app.use("/course", course);
app.use("/instructormg", instructormg);
app.use("/assign", assign);
app.use("/studentreg", studentassign);
app.use("/instructor", instructorfun);