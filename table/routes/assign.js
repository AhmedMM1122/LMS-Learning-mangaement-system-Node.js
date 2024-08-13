// ====================  Required Module ====================
const router = require("express").Router();
const conn = require("../db/dbconnection");
const authorized = require("../middleware/authorized");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");
const util = require("util"); // helper





// ASSign instructor to course [ADMIN]
router.post(
    "/sure",
    admin,
    body("course_name")
    .isString()
    .withMessage("Please enter a valid course name")
    .isLength({ min: 3 ,max:20 })
    .withMessage("Please enter between 3 => 20 char"),

  body("instructor_name")
    .isString()
    .withMessage("Please enter a instructor name ")
    .isLength({ min: 3 , max:20})
    .withMessage("Please enter between 3 => 20 char"),
    async (req, res) => {
      try {
        
   // 1- VALIDATION REQUEST [manual, express validation]
      
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    
  
         // 2- CHECK IF Course EXISTS OR NOT
         const query = util.promisify(conn.query).bind(conn);
         
        const cor = await query("select * from courses where name = ? AND status ='inactive' ",[
          req.body.course_name,
        ]);
        if (!cor[0]) {
          res.status(404).json({ ms: "ERROR ! Course Not found" });
        }
        // 3- CHECK IF instructor EXISTS OR NOT
        const ins = await query("select * from instructor where name = ? AND activity =0",[
            req.body.instructor_name,
          ]);
          if (!ins[0]) {
            res.status(404).json({ ms: "ERROR1 ! Instructor Not found" });
          }
  
        // 3- PREPARE Assigning OBJECT
        const assigninfo = {
          course_name: cor[0].name,
          course_code: cor[0].code,
          instructor_id:ins[0].id,
          instructor_name: ins[0].name,
          
         
        };
  
        // 4 - Update courses and instructors info and INSERT ASSignig info INTO DB
        await query("UPDATE instructor SET activity = 1 WHERE name = ?",[ins[0].name]);
        await query("UPDATE courses SET status = 'active' WHERE name = ?",[cor[0].name]);
        await query("insert into assign set ? ", assigninfo);
        res.status(200).json({
          msg: "instructor Assigned successfully !",
        });

      } catch (err) {
        res.status(500).json(err);
        console.log(err);
      }
    }
  );
  module.exports = router;
