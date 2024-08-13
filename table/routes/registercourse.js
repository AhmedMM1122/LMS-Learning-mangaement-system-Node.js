// ====================  Required Module ====================
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const conn = require('../db/dbconnection');
const util = require("util");
const bcrypt = require("bcrypt");
const student = require("../middleware/student");
const crypto = require("crypto");



router.post("/regcourse",student,
body("student_name").isString().withMessage("plz enter valid name"),
body("course_name").isString().withMessage("plz enter valid course name"),
body("email").isEmail().withMessage("plz enter valid email"),
    body("phone").isMobilePhone().withMessage("plz enter valid phone"),
    async (req, res) => {
        try {
            //for validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const query = util.promisify(conn.query).bind(conn);
           
            const ins1 = await query("SELECT * FROM assign where course_name = ? ",[req.body.course_name]);
           if (!ins1[0]) {
              res.status(404).json({ msg: "course not found" });
            }

            // for exist email
       
       const isExist = await query("select * from regcourse where email=? AND course_name=?", [req.body.email,req.body.course_name]);
       if (isExist.length > 0) {
           res.status(404).json({
               errors: [
                   {
                       "message": "Already assigned to this course ",
                   },
               ],

           });
       }
            const insinfo = {
              email: req.body.email,
         student_name:req.body.student_name,
          phone: req.body.phone,
          course_name :ins1[0].course_name,
          instructorname:ins1[0].instructor_name
           
          };
      

      await query("insert into regcourse set ?", insinfo);
  
      res.status(200).json({
          msg: "course registered successfully !",
        });
      
      
              

        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
            
        }

    });

    router.get("/:id",student, async (req, res) => {
        const query = util.promisify(conn.query).bind(conn);
        const regc = await query("select * from regcourse where id = ?", [
          req.params.id,
        ]);
        if (!regc[0]) {
          res.status(404).json({ ms: "registered course not found !" });
        }
        regc[0].reviews = await query(
          "select * from regcourse where id = ?",
          regc[0].id
        );
        res.status(200).json(regc[0]);
      });
module.exports = router;