const conn = require("../db/dbconnection");
const util = require("util"); // helper

const instructor = async (req, res, next) => {
  const query = util.promisify(conn.query).bind(conn);
  const {token} = req.headers;
  const instructor = await query("select * from users where token = ?", [token]);
  if (instructor[0] && instructor[0].role == 2 && instructor[0].status =="active") {
    next();
  } else {
    res.status(403).json({
      msg: "you are not authorized ",
    });
  }
};

module.exports = instructor;