const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets/index");

module.exports = (req, res, next) => {
  /*
    EKLEYİN
    1- Authorization headerında geçerli token varsa, sıradakini çağırın.
    2- Authorization headerında token yoksa,
      response body şu mesajı içermelidir: "token gereklidir".
    3- Authorization headerında geçersiz veya timeout olmuş token varsa,
	  response body şu mesajı içermelidir: "token geçersizdir".
  */
  try {
    let token = req.headers["authorization"];

    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
          next({
            status: 401,
            message: "token geçerli değil",
          });
        } else {
          req.decodedToken = decodedToken;
          next();
        }
      });
    } else {
      next({
        status: 401,
        message: "token gereklidir",
      });
    }
  } catch (error) {
    next(error);
  }
};