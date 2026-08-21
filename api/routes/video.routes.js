const Router = require("express")

const router = Router()

const {upload} =  require("../middleware/multer.middleware.js")
const {addVideo, editVideo, deleteVideo, getAllVideo} = require("../controllers/video.controller.js")

router.route("/add-video").post(upload.single('videoFile'),addVideo)
router.route("/edit-video").put(upload.single('videoFile'),editVideo)
router.route("/delete-video").delete(deleteVideo)
router.route("/all-video").get(getAllVideo)

module.exports = router