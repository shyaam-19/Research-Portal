import multer from "multer";
import path from "path";
import ExcelJS from "exceljs";
import XLSX from "xlsx";
import fs from "fs";
import {
	ensureDatabaseExists,
	ensureTableExists,
	switchPoolToDb,
} from "../db/databaseFinal.mjs";
import { sql } from "@vercel/postgres";

// Multer configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "./uploads/Journal_Papers/"),
	filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
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
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter,
}).single("file");

// Helper functions
const getTableHeaders = async (client, tableName) => {
	const query = sql`SELECT * FROM public."${tableName}" LIMIT 1;`;
	const result = await client.query(query);
	return result.fields.map((column) => column.name);
};

const normalizeHeaders = (headers) =>
	headers.map((h) => h.toLowerCase()).sort();

const convertToNumberIfNumeric = (value) => {
	if (typeof value === "string") value = value.trim();
	if (!isNaN(value) && typeof value === "string" && value != "") {
		return value.includes(".") ? parseFloat(value) : parseInt(value);
	}
	return value;
};

// Upload Journal Data
const uploadFileJournal = async (req, res) => {
	upload(req, res, async (err) => {
		if (err instanceof multer.MulterError || err) {
			return res.status(400).json({ message: `Error: ${err.message}` });
		}
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const filePath = req.file.path;
		const workbook = XLSX.readFile(filePath);
		const fileExtension = path.extname(filePath); // Extract file extension

		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

		let headers, rows;

		if (fileExtension === ".xls") {
			headers = data[0];
			const rows = data.slice(1).filter((row) => {
				return row.length !== 0;
			});
		} else {
			headers = data[7];
			const rows = data.slice(8).filter((row) => {
				return row.length !== 0;
			});
		}
		const dbName = "NirmaDB";
		const tableName = "Journal_Paper";

		try {
			await ensureDatabaseExists(dbName);
			const newPool = switchPoolToDb(dbName);
			const client = await newPool.connect();

			await ensureTableExists(client, tableName);
			// await ensureTableExists(client, tableName, headers);
			const tableHeaders = await getTableHeaders(client, tableName);

			if (
				JSON.stringify(normalizeHeaders(headers)) !==
				JSON.stringify(normalizeHeaders(tableHeaders))
			) {
				throw new Error(
					"Headers in the Excel file do not match the table."
				);
			}

			for (const row of rows) {
				const paperTitleIndex = headers.indexOf("Paper Title");

				const paperTitle = row[paperTitleIndex];
				// console.log(paperTitle);

				const checkDuplicateQuery = sql`SELECT "Paper Title" FROM "${tableName}" WHERE REPLACE("Paper Title", ' ', '') = REPLACE($1, ' ', '');`; //This is used to check if the Paper Title without spaces is same or not
				// const checkDuplicateQuery = `SELECT "Paper Title" FROM "${tableName}" WHERE "Paper Title" = $1`;
				const result = await client.query(checkDuplicateQuery, [
					paperTitle,
				]);

				console.log(paperTitle, result.rowCount);
				if (result.rowCount === 0) {
					const insertQuery = `INSERT INTO "${tableName}" (${headers
						.map((h) => `"${h}"`)
						.join(", ")})
							VALUES (${headers.map((_, idx) => `$${idx + 1}`).join(", ")})`;
					// console.log(insertQuery);

					await client.query(insertQuery, row);
					await client.query("COMMIT");
				}
			}

			await client.query("COMMIT");
			client.release();
			fs.unlinkSync(filePath);

			res.send("File integrated successfully");
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: `Error: ${error.message}`,
			});
		}
	});
};

// Export Filtered Data
const exportFileJournal = async (req, res) => {
	const { filters, columns } = req.body;
	console.log(req.body);

	const {
		startDate,
		endDate,
		authorName,
		impactFactorMinimum,
		impactFactorMaximum,
		filterOption,
	} = filters;
	const AuthorName = authorName ? authorName.toUpperCase() : null;
	const impactFactorMin = impactFactorMinimum
		? parseFloat(impactFactorMinimum)
		: null;
	const impactFactorMax = impactFactorMaximum
		? parseFloat(impactFactorMaximum)
		: null;

	try {
		let query = sql`SELECT DISTINCT ON (LOWER("Paper Title")) ${columns
			.map((col) => `"${col}"`)
			.join(", ")} FROM public."Journal_Paper" WHERE 1=1`;
		const queryParams = [];

		if (startDate && endDate) {
			query += ` AND TO_DATE("Year of Publication" || '-' || "Month of Publication", 'YYYY-Month') 
			BETWEEN TO_DATE($${queryParams.length + 1}, 'YYYY-MM') 
			AND TO_DATE($${queryParams.length + 2}, 'YYYY-MM')`;
			queryParams.push(startDate, endDate);
		}
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
		if (impactFactorMin != null && impactFactorMax != null) {
			query += ` AND "Impact Factor (Clarivate Analytics)" 
			BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
			queryParams.push(impactFactorMin, impactFactorMax);
		}
		if (filterOption === "SCI") {
			query += ` AND ("IndexIn" LIKE '%Scopus%' AND "IndexIn" LIKE '%Web of Science%')`;
		} else if (filterOption === "Web of Science") {
			query += ` AND "IndexIn" LIKE '%Web of Science%'`;
		} else if (filterOption === "Other") {
			query += ` AND ("IndexIn" NOT LIKE '%Scopus%' AND "IndexIn" NOT LIKE '%Web of Science%')`;
		}
		const dbName = "NirmaDB";
		const tableName = "Journal_Paper";
		await ensureDatabaseExists(dbName);
		const newPool = switchPoolToDb(dbName);
		const client = await newPool.connect();

		await ensureTableExists(client, tableName);
		const result = await newPool.query(query, queryParams);

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Journal Paper Data");
		worksheet.columns = columns.map((col) => ({ header: col, key: col }));

		result.rows.forEach((row) => {
			const filteredRow = {};

			columns.forEach((col) => {
				filteredRow[col] = convertToNumberIfNumeric(row[col]);
			});
			console.log(filteredRow);

			worksheet.addRow(filteredRow);
		});

		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=journal_paper.xlsx"
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

export { uploadFileJournal, exportFileJournal };
