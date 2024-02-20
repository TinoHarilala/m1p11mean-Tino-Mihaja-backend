const { Secret, sign, verify } = require("jsonwebtoken");

const secret_code = "banane";

class Middleware {
    async checkToken(req, token) {
        if (req.originalUrl !== "/login" && req.originalUrl !== "/registration") {
            if (!token) {
                throw new Error("Session expired");
            } else {
                try {
                  const check = verify(token, secret_code);
                } catch (error) {
                  throw error;
                }
            }
        } else {
            console.log("next function");
        }
    }

  createToken(user) {
    try {
      const token = sign({ data: user }, secret_code, { expiresIn: 2400 });
      return token;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { secret_code, Middleware };
