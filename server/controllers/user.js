import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import hacker from "../models/hacker.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingHacker = await hacker.findOne({ email });

    if (!existingHacker) {
      return res.status(500).json({
        status: false,
        message: `User not found. Please sign up`,
      });
    }
    const isPassCorrect = await bcrypt.compare(
      password,
      existingHacker.password
    );

    if (!isPassCorrect) {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }

    const token = jwt.sign(
        {email : existingHacker.email, id : existingHacker._id},
        process.env.JWT_SECRET,
        {expiresIn : '2h'}
    );

    res.status(200).json({
        success : true,
        message : `User Login Successful`,
        result : existingHacker,
        token : token,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Login failed! Please try again.`,
    });
  }
};


export const signup = async (req, res) => {
  const  {firstName, lastName, email, password} = req.body;

  try {
      const existingUser = await hacker.findOne({email});

      //it should not be a duplicate user
      if(existingUser){
        return res.status(500).json({
          success:false,
          message:`User already exists. Please sign in.`
        })
      }

      //hash the password to store it into the DB securely
      const hashedPassword = await  bcrypt.hash(password, 12);

      const result = await hacker.create({
        email ,
        password : hashedPassword, 
        name : `${firstName} ${lastName}`
      });

      const token = jwt.sign({email : result.email, id : result._id}, process.env.JWT_SECRET, {expiresIn : '2h'});

      return res.status(200).json({
        success : true,
        message : `User registered successfully`,
        result : result,
        token : token,
      })
  } catch (error) {
      console.log(error);
      return res.status(500).json({
        success : false,
        message : `Something went wrong. Please try again!`
      })
  }
}

export const syncData = async(req, res) => {
  const {firstName, lastName, email, userPic} = req.body;
  try {
    const existingUser = await hacker.findOne({email});
    if(existingUser)
    {
      console.log("User exists already");
      //if the user already exists
      const token = jwt.sign({email : existingUser.email, id : existingUser._id}, process.env.JWT_SECRET, {expiresIn : '2h'});
      return res.status(200).json({
        success : true,
        message : `Login Succeessful.`,
        result : existingUser,
        token : token,
      })
    }
    else
    {
      //if the user doesnot already exists
      const result = await hacker.create({
        email,
        name : `${firstName} ${lastName}`,
        userPic : userPic,
      })
      const token = jwt.sign({email : result.email, id : result._id}, process.env.JWT_SECRET, {expiresIn : '2h'});
      if(result)
      {
        return res.status(200).json({
          success : true,
          message : `User Created Successfuly`,
          result  : result,
          token : token,
        })
      }

    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : false,
      message : `Something went wrong. Please try again!`
    })
  }
}




























// try {
//   //we need to pass the data given by google auth to the backend
//   console.log(res.data.name)
//   const name = res.data.name.split(" ");
//   const authData = {
//     firstName : name[0],
//     lastName : name.slice(1).join(" "),
//     email : res.data.email,
//     userPic : res.data.picture,
//   }
//   console.log({authData});
//   dispatch(logData(authData));
//   // const response = await enterAuthData()
// } catch (error) {
//   throw new Error(error.response.data.message);
// }









