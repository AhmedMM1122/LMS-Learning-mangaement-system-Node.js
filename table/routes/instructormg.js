// ====================  Required Module ====================
const router = require("express").Router();
const conn = require("../db/dbconnection");
const authorized = require("../middleware/authorized");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadimages");
const util = require("util"); // helper
const fs = require("fs"); // file system

// CREATE Instructor [ADMIN]
router.post(
  "/createins",
  admin,
  upload.single("image"),
  body("name")
    .isString()
    .withMessage("please enter a valid instructor name")
    .isLength({ min: 3 ,max:20 })
    .withMessage("pls enter between 3 => 20 char"),

  body("Field")
    .isString()
    .withMessage("please enter a valid code ")
    .isLength({ min: 20})
    .withMessage("field should be at least 20 char"),
    body("email").isEmail().withMessage("Please enter valid email"),
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- VALIDATE THE IMAGE
      if (!req.file) {
        return res.status(400).json({
          errors: [
            {
              msg: "Image is Required",
            },
          ],
        });
      }

       // 2- CHECK IF insturctor EXISTS OR NOT
       const query = util.promisify(conn.query).bind(conn);
       
      const ins2 = await query("select * from users where email = ? AND role =2",[
        req.body.email,
      ]);
      if (!ins2[0]) {
        res.status(404).json({ ms: "instructor exist" });
      }

      

      // 3- PREPARE instructor OBJECT
      const insinfo = {
        name: req.body.name,
        Field: req.body.Field,
        image_url: req.file.filename,
        user_id:ins2[0].id,
       
      };

      // 4 - INSERT instructor INTO DB
      
      await query("insert into instructor set ? ", insinfo);
      res.status(200).json({
        msg: "instructor created successfully !",
      });
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  }
);

// UPDATE instructor [ADMIN]
router.put(
  "/:id", // params
  admin,
  upload.single("image"),
  body("name")
    .isString()
    .withMessage("please enter a valid instructor name")
    .isLength({ min: 3 ,max:20 })
    .withMessage("Please enter between 3 => 20 char"),

    body("Field")
    .isString()
    .withMessage("please enter a valid Field ")
    .isLength({ min: 20})
    .withMessage("field should be at least 20 char"),
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const query = util.promisify(conn.query).bind(conn);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF instructor EXISTS OR NOT
      const ins = await query("select * from instructor where id = ?", [
        req.params.id,
      ]);
      if (!ins[0]) {
        res.status(404).json({ ms: "instructor not found !" });
      }

      // 3- PREPARE instructor OBJECT
      const insObj = {
        name: req.body.name,
        Field: req.body.Field,
      };

      if (req.file) {
        insObj.image_url = req.file.filename;
        fs.unlinkSync("./upload/" + ins[0].image_url); // delete old image
      }

      // 4- UPDATE instructor
      await query("update instructor set ? where id = ?", [insObj, ins[0].id]);

      res.status(200).json({
        msg: "instructor updated successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// DELETE instructor [ADMIN]
router.delete(
  "/:id", // params
  admin,
  async (req, res) => {
    try {
      // 1- CHECK IF instructor EXISTS OR NOT
      const query = util.promisify(conn.query).bind(conn);
      const ins = await query("select * from instructor where id = ?", [
        req.params.id,
      ]);
      if (!ins[0]) {
        res.status(404).json({ ms: "instructor not found !" });
      }
      // 2- REMOVE instructor IMAGE
      fs.unlinkSync("./upload/" + ins[0].image_url); // delete old image
      await query("delete from instructor where id = ?", [ins[0].id]);
      res.status(200).json({
        msg: "instructor delete successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);


// SHOW instructor [Any USER]
router.get("/:id",admin, async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  const ins = await query("select * from instructor where id = ?", [
    req.params.id,
  ]);
  if (!ins[0]) {
    res.status(404).json({ ms: "instructor not found !" });
  }
  ins[0].image_url = "http://" + req.hostname + ":4000/" + ins[0].image_url;
  ins[0].reviews = await query(
    "select * from instructor where id = ?",
    ins[0].id
  );
  res.status(200).json(ins[0]);
});

// List & Search instructor
router.get("",authorized, async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  let search = "";
  if (req.query.search) {
    // QUERY PARAMS
    search = `where name LIKE '%${req.query.search}%' or Field LIKE '%${req.query.search}%'`;
  }
  const insta = await query(`select * from instructor ${search}`);
  insta.map((instructor) => {
    instructor.image_url = "http://" + req.hostname + ":4000/" + instructor.image_url;
  });
  res.status(200).json(insta);
});
module.exports = router;
