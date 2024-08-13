const conn = require("../db/dbconnection");
const util = require("util"); // helper

const admin = async (req, res, next) => {
  const query = util.promisify(conn.query).bind(conn);
  const {token} = req.headers;
  const admin = await query("select * from users where token = ?", [token]);
  if (admin[0] && admin[0].role == 1 && admin[0].status =="active") {
    next();
  } else {
    res.status(403).json({
      msg: "you are not authorized ",
    });
  }
};

module.exports = admin;