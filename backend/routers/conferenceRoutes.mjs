import { Router } from "express";
import {
	getFilteredConferenceData,
	getConferenceColumns,
} from "../controllers/conferenceDataControllers.mjs";
import multer from "multer";
import { exportFileConference, uploadFileConfernce } from "../controllers/conferenceFileController.mjs";

const router = Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/Conference_Papers");
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB file size limit
});

// Conference Paper routes
router.get("/conferencePaper", getFilteredConferenceData);

router.get("/conferencePaper/columns", getConferenceColumns);
router.post("/conferencePaper/upload", uploadFileConfernce);
router.post("/conferencePaper/export",exportFileConference);

export default router;
