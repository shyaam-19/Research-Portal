export const BASE_URL = "http://localhost:5000/api";

export const endpoints = {
	GET_JOURNAL: BASE_URL + "/journalPaper",
	GET_JOURNAL_DASHBOARD: BASE_URL + "/journalPaper/Dashboard",
	GET_JOURNAL_COLUMNS: BASE_URL + "/journalPaper/columns",
	EXPORT_JOURNAL: BASE_URL + "/journalPaper/export",
	UPLOAD_JOURNAL: BASE_URL + "/journalPaper/upload",
	
	GET_CONFERENCE_PAPERS: BASE_URL + "/conferencePaper",
	GET_CONFERENCE_COLUMNS:  BASE_URL + "/conferencePaper/columns",
	EXPORT_CONFERENCE: BASE_URL + "/conferencePaper/export",
	UPLOAD_CONFERENCE: BASE_URL + "/conferencePaper/upload",
};


