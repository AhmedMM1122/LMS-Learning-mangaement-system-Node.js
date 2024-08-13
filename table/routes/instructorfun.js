// ====================  Required Module ====================
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const conn = require('../db/dbconnection');
const util = require("util");
const bcrypt = require("bcrypt");
const instructor = require("../middleware/instructor");
const crypto = require("crypto");



router.get("/:instructor_name1",instructor, async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const enroll = await query("select * from assign where instructor_name = ?", [
      req.params.instructor_name1,
    ]);
    if (!enroll[0]) {
      res.status(404).json({ ms: "instructor profile not found !" });
    }
    const enroll2 = await query("select * from regcourse where instructorname = ? ",[
        req.params.instructor_name1,
      ]);
      if (!enroll2[0]) {
        res.status(404).json({ ms: "instructor doesnt have any enrolled student !" });
      }
    
      
   let result = enroll2.map((item,index,array) => {
    return item.student_name
   })
    res.status(200).json(result);
  });


  router.put(
    "/:instructorname/setgrade",
    instructor,
    body("course_name")
    .isString()
    .withMessage("Please enter a valid course name")
    .isLength({ min: 3 ,max:20 })
    .withMessage("Please enter between 3 => 20 char"),
    
  body("student_name")
    .isString()
    .withMessage("Please enter a student name ")
    .isLength({ min: 3 , max:20})
    .withMessage("Please enter between 3 => 20 char"),
    body("grade").isInt().withMessage("Please enter valid grade").isLength({max: 4}).withMessage("Please enter between 1 num to 4"),
    async (req, res) => {
      try {
        
   // 1- VALIDATION REQUEST [manual, express validation]
      
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
   // 2- CHECK IF information of course name and student EXISTS for the instructor OR NOT
  const query = util.promisify(conn.query).bind(conn);
  const sure = await query("select * from regcourse where instructorname = ? AND student_name = ? AND course_name =?",[
    req.params.instructorname,req.body.student_name,req.body.course_name,
  ]);
  if (!sure[0]) {
    res.status(404).json({ ms: "ERROR student name or course name is wrong " });
  }
  
        
  
        // 4 - Update grade
        await query("UPDATE regcourse SET grade = ?  where instructorname = ? AND student_name = ? AND course_name =? ",[req.body.grade,sure[0].instructorname,sure[0].student_name,sure[0].course_name]);
        
        res.status(200).json({
          msg: "grade Assigned successfully !",
        });

      } catch (err) {
        res.status(500).json(err);
        console.log(err);
      }
    }
  );
  module.exports = router;

  
