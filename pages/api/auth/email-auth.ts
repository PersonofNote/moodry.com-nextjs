const config = {secret: process.env.AUTH_SECRET_KEY};
import connectMongo from "../../../lib/connectMongo";

import db from "../../../models";
import { User } from '../../../models/user.model'
// const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

export default async function emailSignin(req: import('next').NextApiRequest, res: import('next').NextApiResponse) {
    try {
    
        await connectMongo();

        const user = await User.findOne({
            email: req.body.email
            })
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Old password doesn't match"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      /*
      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      */
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        // roles: authorities,
        accessToken: token
      });

      } catch (error) {
        console.log(error);
        res.json({ error });
      }



};

// This is borked... but why?
/*
exports.updatePassword = async (req, res) => {
  console.log(req.body)
  if (req.body.newPassword.length < 6) {
    res.status(403).send({message: "Password must be longer than 6 characters"})
  }
  const user = User.findOne({
    _id: req.body.user_id
  })
    .exec((err, user) => {
      console.log("USER FOUND:")
      console.log(user)
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.oldPassword,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          message: "Invalid Password!"
        });
      }
    });
    try {
      await User.updateOne(
        { _id : req.body.id},
        { $set: { "password" :  bcrypt.hashSync(req.body.newPassword, 8) } }
     );
     res.status(200).send({message: "Password updated successfully"})
   } catch (e) {
      print(e);
      res.status(500).send({message: "Something went wrong"})
   }

};
*/