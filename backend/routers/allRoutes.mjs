import { Router } from "express";
import axios from "axios"; 


const router = Router();
const FASTAPI_BASE_URL = "http://localhost:8000"; // FastAPI server URL
import {
    getJournalDashboard,
    getJournalData,
    getJournalColumns,
} from "../controllers/journalDataControllers.mjs";
import multer from "multer";
import {
    exportFileJournal,
    uploadFileJournal,
} from "../controllers/journalFileController.mjs";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/Journal_Papers");
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB file size limit
});

// Journal Paper route with filters
router.get("/journalPaper", getJournalData);
router.get("/journalPaper/Dashboard", getJournalDashboard);
router.get("/journalPaper/columns", getJournalColumns);
router.post("/journalPaper/export", exportFileJournal);
router.post("/journalPaper/upload", uploadFileJournal);

router.get("/scholar/nirma-count", async (req, res) => {
    try {
        const { authors } = req.query;
        const response = await axios.get(`${FASTAPI_BASE_URL}/nirma-count/?authors=${authors}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

router.get("/scholar/:scholarName", async (req, res) => {
    try {
        const { scholarName } = req.params;
        const response = await axios.get(`${FASTAPI_BASE_URL}/scholar/${scholarName}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

router.get("/scholar/publications/:scholarName", async (req, res) => {
    try {
        const { scholarName } = req.params;
        const { year } = req.query;
        const url = year 
            ? `${FASTAPI_BASE_URL}/publications/${scholarName}?year_filter=${year}`
            : `${FASTAPI_BASE_URL}/publications/${scholarName}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});


export default router;
