const { ApiError } = require("../utils/ApiError")
const db = require("../models/index.js")
const Admin = db.admin
const { ApiResponse } = require("../utils/ApiResponse")

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) throw new ApiError(400, "All fields are required")

        const foundAdmin = await Admin.findOne({ where: { email, password }, attributes: ['id', 'email'] })

        if (!foundAdmin) throw new ApiError(400, "There no admin founds")

        return res
            .status(200)
            .json(new ApiResponse(200, foundAdmin, "Admin Logged in successful"))
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong")
    }
}

module.exports = { login }
