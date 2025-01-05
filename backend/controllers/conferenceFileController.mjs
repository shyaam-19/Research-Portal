import xlsx from "xlsx";
import ExcelJS from "exceljs";
import fs from "fs";
import {
	ensureDatabaseExists,
	ensureTableExists,
	switchPoolToDb,
} from "../db/databaseFinal.mjs";
import multer from "multer";
import path from "path";

import moment from "moment";
import { sql ,db} from "@vercel/postgres";

// Multer storage settings
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/Conference_Papers/");
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const fileFilter = (req, file, cb) => {
	const fileTypes = /xls|xlsx/;
	const extname = fileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype =
		file.mimetype === "application/vnd.ms-excel" ||
		file.mimetype ===
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

	if (mimetype && extname) {
		cb(null, true);
	} else {
		cb(new Error("Only .xls and .xlsx files are allowed!"), false);
	}
};

const upload = multer({
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: fileFilter,
}).single("file");

// Helper function to fetch table headers from the database
const getTableHeaders = async (client, tableName) => {
	const query = sql`SELECT * FROM public."${tableName}" LIMIT 1;`;
	const result = await client.query(query);

	// Extract column names from the query result
	return result.fields.map((column) => column.name);
};

// Helper function to sort and lowercase headers
const normalizeHeaders = (headers) => {
	// console.log(headers);

	return headers.map((header) => header.toLowerCase()).sort();
};

// Helper function to detect and handle dates
const parseDate = (dateString) => {
	// Check if the date is a number (Excel stores dates as serial numbers sometimes)
	if (typeof dateString === "number") {
		// Convert Excel serial date to JavaScript date
		const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's base date
		return new Date(excelEpoch.getTime() + dateString * 86400000)
			.toISOString()
			.split("T")[0]; // Convert to YYYY-MM-DD
	}

	// If the date is a string, try to parse it with moment.js
	// Try common date formats, including two-digit years
	const formats = [
		"DD/MM/YYYY",
		"MM/DD/YYYY",
		"YYYY-MM-DD",
		"MM/DD/YY",
		"DD/MM/YY",
	];

	const parsedDate = moment(dateString, formats, true);

	// If moment.js successfully parses the date, return in PostgreSQL-friendly format (YYYY-MM-DD)
	if (parsedDate.isValid()) {
		return parsedDate.format("YYYY-MM-DD");
	}

	// Fallback: if the date string is not valid according to moment, try using native Date
	const nativeParsedDate = new Date(dateString);
	if (!isNaN(nativeParsedDate)) {
		// Convert native JS Date to YYYY-MM-DD format
		return nativeParsedDate.toISOString().split("T")[0];
	}

	// If still invalid, throw an error
	throw new Error(`Invalid date format: ${dateString}`);
};
const convertToNumberIfNumeric = (value) => {
	if (typeof value === "string") value = value.trim();
	if (!isNaN(value) && typeof value === "string" && value != "") {
		return value.includes(".") ? parseFloat(value) : parseInt(value);
	}
	return value;
};
// File upload controller
const uploadFileConfernce = (req, res) => {
	upload(req, res, async function (err) {
		if (err instanceof multer.MulterError) {
			return res
				.status(500)
				.json({ message: `Multer error: ${err.message}`, error: err });
		} else if (err) {
			return res.status(400).json({ message: `Error: ${err.message}` });
		}

		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const filePath = req.file.path;
		const fileExtension = path.extname(filePath); // Extract file extension
		console.log(fileExtension);

		const workbook = xlsx.readFile(filePath);
		const sheet = workbook.Sheets[workbook.SheetNames[0]];

		const data = xlsx.utils.sheet_to_json(sheet, {
			header: 1, // First row is the headers
			cellDates: true, // Convert date se  value is used instead of the raw value
		});

		let headers, rows; 

		if (fileExtension === ".xls") {
			headers = data[0]; 
			rows = data.slice(1);
		} else {
			headers = data[7];
			rows = data.slice(8);
		}

		const dbName = "NirmaDB";
		const tableName = "Conference_Paper";

		try {
			// Ensure the database exists
			await ensureDatabaseExists(dbName);

			// Reconnect to the new database
			const newPool = switchPoolToDb(dbName);
			const client = await newPool.connect();

			// Ensure table exists or create it
			await ensureTableExists(client, tableName);

			// Fetch the actual table headers from the database using new logic
			const tableHeaders = await getTableHeaders(client, tableName);

			// Normalize and sort both Excel headers and SQL headers
			const normalizedExcelHeaders = normalizeHeaders(headers);
			const normalizedTableHeaders = normalizeHeaders(tableHeaders);

			// Compare headers
			if (
				JSON.stringify(normalizedExcelHeaders) !==
				JSON.stringify(normalizedTableHeaders)
			) {
				throw new Error(
					`The headers in the Excel file do not match the table's headers.`
				);
			}

			// Insert rows from Excel
			for (const row of rows) {
				const paperTitleIndex = headers.indexOf("Paper Title");
				const paperTitle = row[paperTitleIndex];

				const fromDateIndex = headers.indexOf("From Date");
				const toDateIndex = headers.indexOf("To Date");

				// Parse and convert dates to the format PostgreSQL expects (YYYY-MM-DD)
				row[fromDateIndex] = parseDate(row[fromDateIndex]);
				row[toDateIndex] = parseDate(row[toDateIndex]);

				const checkDuplicateQuery = sql`SELECT * FROM "${tableName}" WHERE "Paper Title" = $1`;
				const result = await client.query(checkDuplicateQuery, [
					paperTitle,
				]);

				if (result.rowCount === 0) {
					const insertQuery = `INSERT INTO "${tableName}" (${headers
						.map((header) => `"${header}"`)
						.join(", ")})
                                        VALUES (${headers
											.map((_, idx) => `$${idx + 1}`)
											.join(", ")})`;
					await client.query(insertQuery, row);
				}
			}

			await client.query("COMMIT");
			client.release();

			// Remove the uploaded file
			fs.unlinkSync(filePath);

			res.send("File integrated successfully");
		} catch (err) {
			console.error(err);
			await ensureDatabaseExists(dbName);

			// Reconnect to the new database
			const newPool = switchPoolToDb(dbName);
			const client = await newPool.connect();

			// Ensure table exists or create it
			await ensureTableExists(client, tableName);

			// Fetch the actual table headers from the database using new logic
			const tableHeaders = await getTableHeaders(client, tableName);
			const normalizedExcelHeaders = normalizeHeaders(headers);
			const normalizedTableHeaders = normalizeHeaders(tableHeaders);
			res.status(500).json({
				message: `Error: ${err.message}`,
				excelHeaders: normalizedExcelHeaders,
				tableHeaders: normalizedTableHeaders,
			});
		}
	});
};

// Export Filtered Data
const exportFileConference = async (req, res) => {
	const { filters, columns } = req.body;
	console.log(filters);

	const { fromDate, toDate, authorName } = filters;
	const AuthorName = authorName ? authorName.toUpperCase() : null;

	try {
		let query = sql`SELECT DISTINCT ON (LOWER("Paper Title")) ${columns
			.map((col) => `"${col}"`)
			.join(", ")} FROM public."Conference_Paper" WHERE 1=1`;
		const queryParams = [];

		if (AuthorName) {
			query += ` AND ("Author1" LIKE $${
				queryParams.length + 1
			} OR "Author2" LIKE $${queryParams.length + 1} 
                       OR "Author3" LIKE $${
							queryParams.length + 1
						} OR "Author4" LIKE $${queryParams.length + 1}
                       OR "Author5" LIKE $${
							queryParams.length + 1
						} OR "Author6" LIKE $${queryParams.length + 1}
                       OR "Author7" LIKE $${
							queryParams.length + 1
						} OR "Author8" LIKE $${queryParams.length + 1}
                       OR "Author9" LIKE $${
							queryParams.length + 1
						} OR "Author10" LIKE $${queryParams.length + 1})`;

			queryParams.push(`%${AuthorName}%`);
			// queryParams.push(authorName);
		}

		const dbName = "NirmaDB";
		const tableName = "Conference_Paper";
		await ensureDatabaseExists(dbName);
		const newPool = switchPoolToDb(dbName);
		const client = await newPool.connect();

		await ensureTableExists(client, tableName);
		const result = await newPool.query(query, queryParams);
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Conference Paper Data");
		worksheet.columns = columns.map((col) => ({ header: col, key: col }));

		result.rows.forEach((row) => {
			const filteredRow = {};
			columns.forEach((col) => {
				filteredRow[col] = convertToNumberIfNumeric(row[col]);
			});
			worksheet.addRow(filteredRow);
		});

		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=conference_paper.xlsx"
		);

		await workbook.xlsx.write(res);
		res.end();
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "An error occurred while exporting data",
		});
	}
};
export { uploadFileConfernce, exportFileConference };
