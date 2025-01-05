import axios from "axios";
import { BASE_URL, endpoints } from "./apiEndPoints.mjs";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || BASE_URL,
});

export const fetchJournal = ({
	startDate = "",
	endDate = "",
	authorName = "",
	impactFactorMinimum = "",
	impactFactorMaximum = "",
	filterOption = "",
}) => {
	console.log({
		startDate,
		endDate,
		authorName,
		impactFactorMinimum,
		impactFactorMaximum,
		filterOption,
	});
	console.log(
		`${endpoints.GET_JOURNAL}?startDate=${startDate}&endDate=${endDate}&authorName=${authorName}&impactFactorMinimum=${impactFactorMinimum}&impactFactorMaximum=${impactFactorMaximum}&filterOption=${filterOption}`
	);

	return api.get(
		`${endpoints.GET_JOURNAL}?startDate=${startDate}&endDate=${endDate}&authorName=${authorName}&impactFactorMinimum=${impactFactorMinimum}&impactFactorMaximum=${impactFactorMaximum}&filterOption=${filterOption}`
	);
};
export const fetchJournalColumns = () => {
	console.log(`${endpoints.GET_JOURNAL_COLUMNS}`);
	return api.get(`${endpoints.GET_JOURNAL_COLUMNS}`);
};
export const exportJournal = (data) => {
	console.log(`${endpoints.EXPORT_JOURNAL}`);
	return api.post(`${endpoints.EXPORT_JOURNAL}`, data, {
		responseType: "blob", // Important for downloading files
	});
};

export const fetchConferenceData = ({
	fromDate = "",
	toDate = "",
	authorName = "",
}) => {
	console.log({
		fromDate,
		toDate,
		authorName,
	});
	console.log(
		`${endpoints.GET_CONFERENCE_PAPERS}?fromDate=${fromDate}&toDate=${toDate}&authorName=${authorName}`
	);

	return api.get(
		`${endpoints.GET_CONFERENCE_PAPERS}?fromDate=${fromDate}&toDate=${toDate}&authorName=${authorName}`
	);
};

// Function to fetch conference paper columns
export const fetchConferenceColumns = () => {
	console.log(`${endpoints.GET_CONFERENCE_COLUMNS}`);
	return api.get(`${endpoints.GET_CONFERENCE_COLUMNS}`);
};

// Function to export conference paper data
export const exportConference = (data) => {
	console.log(`${endpoints.EXPORT_CONFERENCE}`);
	return api.post(`${endpoints.EXPORT_CONFERENCE}`, data, {
		responseType: "blob", // Important for downloading files
	});
};

export const uploadJournal = (formData) => {
	console.log(`${endpoints.UPLOAD_JOURNAL}`); // Assuming you have an endpoint defined for this
	return api.post(`${endpoints.UPLOAD_JOURNAL}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
export const uploadConference = (formData) => {
	console.log(`${endpoints.UPLOAD_CONFERENCE}`); // Assuming you have an endpoint defined for this
	return api.post(`${endpoints.UPLOAD_CONFERENCE}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

export const journalDashboard = () => {
	return api.get(`${endpoints.GET_JOURNAL_DASHBOARD}`);
};
