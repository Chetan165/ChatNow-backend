const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  try {
    const validToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(validToken);
    req.userid = validToken.UserName;
    req._id = validToken._id;
    console.log(req.userid, req._id);
  } catch (err) {
    console.log(err);
  }
  next();
};
module.exports = authMiddleware;
