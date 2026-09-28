const express = require("express");
const Joi = require("joi");

const app = express();

app.use(express.json());

const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).required()
});

app.post("/users", (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  // Data is valid here
  console.log(value);

  res.json({
    message: "User created"
  });
});

app.listen(8000, ()=>{
  console.log("app is listening port on 8000");
})