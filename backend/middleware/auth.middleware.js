// // import jwt from "jsonwebtoken";
// // import { ApiError } from "../utils/ApiError.js";
// // import { asyncHandler } from "../utils/asyncHandler.js";
// // import { User } from "../model/users.model.js";

// const { ApiError } = require("../utils/ApiError.js")
// const { ApiResponse } = require("../utils/ApiResponse.js")
// const { asyncHandler } = require("../utils/asyncHandler.js")
// // const jwt = require("jsonwebtoken")

// const verifyUserWithToken = asyncHandler(async (req, _, next) => {
//     console.log(`${req.method} ${req.route.path}`,"METHODS")
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       throw new ApiError(401, "Unauthorized request");
//     }
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     const user = await User.findByPk(decodedToken._id, { raw: true });

//     req.user = user;
//     console.log("A", user.user_id);

//     next();
//   } catch (error) {
//     throw new ApiError(401, "Token verification failed", [error.message]);
//   }
// });

// // export { verifyUserWithToken };
// module.exports = {verifyUserWithToken}
