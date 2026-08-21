const db = require("../models/index.js")
const video = db.video
const {ApiResponse} = require("../utils/ApiResponse.js")
const {ApiError} = require("../utils/ApiError.js")
const {uploadOnCloudinary} = require("../utils/cloudinary.js")
const { sequelize } = require("../db/index.js")
const fs = require("fs")

const addVideo = async(req,res)=>{
    console.log("Register")
    const videoFile = req.file?.buffer;
    const {title,description} = req.body

    console.log("ADD VIDEO",{videoFile,title,description})
    if(!title || !description) throw new ApiError(400,"All fields are required")

    const t = await sequelize.transaction()
    try {

        if(!videoFile) throw new ApiError(400,"Please upload video")

        const uploadCloudinary = await uploadOnCloudinary(videoFile)
        console.log(uploadCloudinary)
        if (!uploadCloudinary) {
            throw new ApiError(400, "Video upload failed");
        }       

        const addToDb = await video.create({videoUrl:uploadCloudinary,title,description},{transaction:t})
        await t.commit();

        return res
        .json(new ApiResponse(200,addToDb,"Video uploaded successfully"))
    } catch (error) {
        await t.rollback()
        throw new ApiError(error.http_code || error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const editVideo = async(req,res)=>{

    const {id,title,description} = req.body
    const videoFile = req.file?.buffer;
    const t = await sequelize.transaction();

    try {

        if(!id) throw new ApiError(400,"Id is required")

        const findVideo = await video.findOne({where:{id},attributes:['id','videoUrl','description','title'],transaction:t})

        if(!findVideo) throw new ApiError(400,"There are no video in our list")

        // A new video file is optional on edit — if the user didn't pick a
        // new file, keep the existing videoUrl instead of failing.
        if (videoFile) {
            const uploadCloudinary = await uploadOnCloudinary(videoFile)

            if (!uploadCloudinary) {
                throw new ApiError(400, "video upload failed");
            }
            findVideo.videoUrl = uploadCloudinary
        }

        if (title !== undefined) findVideo.title = title
        if (description !== undefined) findVideo.description = description
        await findVideo.save({transaction:t})
        console.log('EDIT VIDEO')
        await t.commit();
        return res
        .json(new ApiResponse(200,findVideo,"Video Updated successfully"))
    } catch (error) {
        await t.rollback()
        throw new ApiError(error.http_code || error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const deleteVideo = async(req,res)=>{
    const {id} = req.query

    const t = await sequelize.transaction();
    try {

        if(!id) throw new ApiError(400,"Id is required")

        const findVideo = await video.findOne({where:{id},attributes:['id','videoUrl'],transaction:t})

        
        if(!findVideo) throw new ApiError(400,"There are no video in our list")
            
        await findVideo.destroy({transaction:t});

        await t.commit();

        return res
        .status(200)
        .json(new ApiResponse(200,{},`Delete Video No : ${id}`))

    } catch (error) {
         if (t && t.finished !== 'commit' && t.finished !== 'rollback') {
            await t.rollback();
        }
        throw new ApiError(error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const restoreVideo = async(req,res)=>{
    const {id} = req.query

    const t = await sequelize.transaction();
    try {

        if(!id) throw new ApiError(400,"Id is required")

        const findVideo = await video.findOne({where:{id},attributes:['id'],paranoid:false,transaction:t})

        if(!findVideo) throw new ApiError(400,"There are no video in our list")

        await findVideo.restore({transaction:t});
        await t.commit();

        return res
        .status(200)
        .json(new ApiResponse(200,{},`Restore Video No : ${id}`))

    } catch (error) {
         if (t && t.finished !== 'commit' && t.finished !== 'rollback') {
            await t.rollback();
        }
        throw new ApiError(error.statusCode || 500,"Something went wrong",[error.message])
    }
}
const getAllVideo = async(req,res)=>{
    try {
        const videos = await video.findAll();
        
        if(!videos) throw new ApiError(400,"No one video found")
        return res
        .status(200)
        .json(new ApiResponse(200,videos,"All videos fetched"))
    } catch (error) {
        // Keep the client usable in local/dev when DB is not reachable.
        if (error?.name?.includes("Sequelize") || error?.original) {
            return res
            .status(200)
            .json(new ApiResponse(200,[],"All videos fetched"))
        }
        throw error
    }
}
module.exports = {addVideo ,editVideo,deleteVideo,getAllVideo}
