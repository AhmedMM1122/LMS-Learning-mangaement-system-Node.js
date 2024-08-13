// ====================  Required Module ====================
const router = require("express").Router();
const conn = require("../db/dbconnection");
const authorized = require("../middleware/authorized");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadimages");
const util = require("util"); // helper
const fs = require("fs"); // file system

// CREATE COURSE [ADMIN]
router.post(
  "/create",
  admin,
  upload.single("image"),
  body("name")
    .isString()
    .withMessage("Please enter a valid course name")
    .isLength({ min: 3 ,max:20 })
    .withMessage("Please enter between 3 => 20 char"),

  body("code")
    .isInt()
    .withMessage("Please enter a valid code ")
    .isLength({ min: 1 , max:4})
    .withMessage("Please enter between 1 => 4 num"),
    body("Description")
    .isString()
    .withMessage("Please enter a valid description")
    .isLength({ min: 20  })
    .withMessage("Please enter at least 20 char"),
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
      
       // for exist course
       const query = util.promisify(conn.query).bind(conn);
       const isnameExist = await query("select * from courses where name=?", [req.body.name]);
       if (isnameExist.length > 0) {
           res.status(404).json({
               errors: [
                   {
                       "message": "Course already exist ",
                   },
               ],

           });
       }

       // for exist code
       const iscodeExist = await query("select * from courses where code=?", [req.body.code]);
       if (iscodeExist.length > 0) {
           res.status(404).json({
               errors: [
                   {
                       "message": "Code is used ,Please choose another code",
                   },
               ],

           });
       }
      // 3- PREPARE Course OBJECT
      const course = {
        name: req.body.name,
        code: req.body.code,
        image_url: req.file.filename,
        Description:req.body.Description,
      };

      // 4 - INSERT Course INTO DB
      
      await query("insert into courses set ? ", course);
      res.status(200).json({
        msg: "Course created successfully !",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// UPDATE Course [ADMIN]
router.put(
  "/:id", // params
  admin,
  upload.single("image"),
  body("name")
    .isString()
    .withMessage("please enter a valid course name")
    .isLength({ min: 3 ,max:20 })
    .withMessage("Please enter between 3 => 20 char"),

    body("code")
    .isInt()
    .withMessage("please enter a valid code ")
    .isLength({ min: 1 , max:4})
    .withMessage("Please enter between 1 => 4 num"),
    body("Description")
    .isString()
    .withMessage("Please enter a valid description")
    .isLength({ min: 20  })
    .withMessage("Please enter at least 20 char"),
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const query = util.promisify(conn.query).bind(conn);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF Course EXISTS OR NOT
      const course = await query("select * from courses where id = ?", [
        req.params.id,
      ]);
      if (!course[0]) {
        res.status(404).json({ ms: "course not found !" });
      }

      // 3- PREPARE Course OBJECT
      const courseObj = {
        name: req.body.name,
        code: req.body.code,
        Description:req.body.Description,
      };

      if (req.file) {
        courseObj.image_url = req.file.filename;
        fs.unlinkSync("./upload/" + course[0].image_url); // delete old image
      }

      // 4- UPDATE Course
      await query("update courses set ? where id = ?", [courseObj, course[0].id]);

      res.status(200).json({
        msg: "course updated successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// DELETE Course [ADMIN]
router.delete(
  "/:id", // params
  admin,
  async (req, res) => {
    try {
      // 1- CHECK IF Course EXISTS OR NOT
      const query = util.promisify(conn.query).bind(conn);
      const course = await query("select * from courses where id = ?", [
        req.params.id,
      ]);
      if (!course[0]) {
        res.status(404).json({ ms: "course not found !" });
      }
      // 2- REMOVE Course IMAGE
      fs.unlinkSync("./upload/" + course[0].image_url); // delete old image
      await query("delete from courses where id = ?", [course[0].id]);
      res.status(200).json({
        msg: "course delete successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);


// SHOW Course [Any USER]
router.get("/:id",authorized, async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  const course = await query("select * from courses where id = ?", [
    req.params.id,
  ]);
  if (!course[0]) {
    res.status(404).json({ ms: "course not found !" });
  }
  course[0].image_url = "http://" + req.hostname + ":4000/" + course[0].image_url;
  course[0].reviews = await query(
    "select * from courses where id = ?",
    course[0].id
  );
  res.status(200).json(course[0]);
});

//List & Search Course [Any USER]
router.get("",authorized, async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  let search = "";
  if (req.query.search) {
    // QUERY PARAMS
    search = `where name LIKE '%${req.query.search}%' or code LIKE '%${req.query.search}%'`;
  }
  const coursee = await query(`select * from courses ${search}`);
  coursee.map((course) => {
    course.image_url = "http://" + req.hostname + ":4000/" + course.image_url;
  });
  res.status(200).json(coursee);
});
module.exports = router;
