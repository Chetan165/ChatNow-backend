const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  try {
    const validToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(validToken);
    req.userid = validToken.UserName;
    req._id = validToken._id;
    req.Picture = validToken.Picture;
    console.log(req.userid, req._id, req.Picture);
  } catch (err) {
    res.json({ ok: false, msg: "Invalid Token" });
  }
  next();
};
module.exports = authMiddleware;
