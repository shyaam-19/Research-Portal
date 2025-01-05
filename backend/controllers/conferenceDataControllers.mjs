import exp from "constants";
import { parse } from "csv-parse"; // If you're dealing with CSV uploads
import fs from "fs";
import path from "path";
import {
	pool,
	ensureDatabaseExists,
	ensureTableExists,
	switchPoolToDb,
} from "../db/databaseFinal.mjs";

import { sql,db } from "@vercel/postgres";

function formatDate(dateString) {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}
// Function to get filtered conference data
const getFilteredConferenceData = async (req, res) => {
	const { fromDate, toDate, authorName } = req.query;
	console.log({ fromDate, toDate, authorName });
	console.log("dddddd");

	let query = sql`SELECT * FROM public."Conference_Paper" WHERE 1=1`;
	const queryParams = [];

	// if (fromDate) {
	// 	query += " AND from_date >= ?";
	//     query += `
	// 		AND TO_DATE("From_date", 'YYYY-MM-DD')
	// 		BETWEEN TO_DATE($${queryParams.length + 1}, 'DD/MM/YYYY') AND TO_DATE($${
	// 			queryParams.length + 2
	// 		}, 'DD/MM/YYYY')`;
	// 	queryParams.push(fromDate);
	// }
	// if (toDate) {
	// 	query += " AND to_date <= ?";
	// 	queryParams.push(toDate);
	// }
	const AuthorName = authorName ? authorName.toUpperCase() : null;
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

	try {
		const dbName = "NirmaDB";
		const tableName = "Conference_Paper";
		await ensureDatabaseExists(dbName);

		// Reconnect to the new database
		const newPool = switchPoolToDb(dbName);
		const client = await newPool.connect();

		// Ensure table exists or create it
		await ensureTableExists(client, tableName);

		const result = await newPool.query(query, queryParams);

		// const result = await pool.query(query, queryParams);

		// res.json(result.rows);
		const formattedRows = result.rows.map((row) => {
			row["From Date"] = formatDate(row["From Date"]);
			row["To Date"] = formatDate(row["To Date"]);
			return row;
		});

		res.json(formattedRows); // Logs the result with formatted dates
	} catch (error) {
		console.error("Error fetching conference data:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const getConferenceColumns = async (req, res) => {
	// try {
	//     // Query to fetch column names from PostgreSQL information schema
	//     const query = `
	//         SELECT column_name
	//         FROM information_schema.columns
	//         WHERE table_name = 'Conference_Paper';
	//     `;

	//     const result = await pool.query(query);
	//     const columns = result.rows.map((row) => row.column_name);

	//     res.json(columns);
	// } catch (err) {
	//     console.error("Error fetching conference columns:", err);
	//     res.status(500).json({ error: "Internal Server Error" });
	// }

	try {
		// Query to fetch column names from PostgreSQL information schema
		const query = sql`SELECT * FROM public."Conference_Paper" LIMIT 1;`;
		const dbName = "NirmaDB";
		const tableName = "Conference_Paper";
		await ensureDatabaseExists(dbName);

		// Reconnect to the new database
		const newPool = switchPoolToDb(dbName);
		const client = await newPool.connect();

		// Ensure table exists or create it
		await ensureTableExists(client, tableName);

		const result = await newPool.query(query);
		// const result = await pool.query(query);
		const columns = result.fields.map((column) => {
			return column.name;
		});
		console.log("result");
		console.log(columns);

		res.json(
			result.fields.map((column) => {
				return column.name;
			})
		);
	} catch (err) {
		console.error("Error fetching journal columns:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export { getFilteredConferenceData, getConferenceColumns }; //Dashboard function left


