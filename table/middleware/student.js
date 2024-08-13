const conn = require("../db/dbconnection");
const util = require("util"); // helper

const student = async (req, res, next) => {
  const query = util.promisify(conn.query).bind(conn);
  const {token} = req.headers;
  const student = await query("select * from users where token = ?", [token]);
  if (student[0] && student[0].role == 0 && student[0].status =="active") {
    next();
  } else {
    res.status(403).json({
      msg: "you are not authorized ",
    });
  }
};

module.exports = student;