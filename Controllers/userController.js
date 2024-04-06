//importing modules
const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");




// Assigning users to the variable User
const User = db.users;
//signing a user up
//hashing users password before its saved to the database with bcrypt
const Register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const data = {
      userName,
      email,
      password: await bcrypt.hash(password, 10),
    };
    //saving the user
    const user = await User.create(data);


    //if user details is captured
    //generate token with the user's id and the secretKey in the env file
    // set cookie with the token generated
    if (user) {
      let token = jwt.sign({ user: user.dataValues }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      // set cookie with the token generated
      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

      //send users details
      return res.status(201).send({ user: user, token: token });
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log(error);
  }
};

//login authentication

const login = async (req, res) => {
  try {
    const { email, password } = req.body;


	  if (email == undefined || password == undefined) {
      return res.status(400).send("Please enter your email and password");
    }

    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email
      }

    });
    if (!user) {
      return res.status(401).send("Authentication failed");
    }


    console.log(await User.findAll());

    console.log(user);
    //if user email is found, compare password with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      //if password is the same
      //generate token with the user's id and the secretKey in the env file

      if (isSame) {
        let token = jwt.sign({ user: user.dataValues }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        //if password matches wit the one in the database
        //go ahead and generate a cookie for the user
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);

        
        //send user data
        return res.status(201).send({ user: user, token: token });
      } else {
        return res.status(401).send("Authentication failed");
      }
    } else {
      return res.status(401).send("Authentication failed");
    }
  } catch (error) {
    console.log(error);
  }
};


// get profile from token 
const getProfile = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    console.log(token);
    if (token) {
      jwt.verify(token, process.env.secretKey, async (err, decoded) => {
        if (err) {
          return res.status(403).send("Token is invalid");
        } else {
          //
          const user = await User.findOne({
            where: {
              id: decoded.user.id
            }
          });
          return res.status(200).send(user);
        }
      });
    } else {
      return res.status(401).send("Authentication failed");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  Register,
  login,
  getProfile
};
