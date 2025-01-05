import { sql } from "@vercel/postgres";
import {
	pool,
	ensureDatabaseExists,
	ensureTableExists,
	switchPoolToDb,
} from "../db/databaseFinal.mjs";

const getJournalData = async (req, res) => {
	try {
		const {
			startDate,
			endDate,
			authorName,
			impactFactorMaximum,
			impactFactorMinimum,
			filterOption,
		} = req.query;
		console.log({
			startDate,
			endDate,
			authorName,
			impactFactorMinimum,
			impactFactorMaximum,
			filterOption,
		});

		const impactFactorMin = impactFactorMinimum
			? parseFloat(impactFactorMinimum)
			: null;
		const impactFactorMax = impactFactorMaximum
			? parseFloat(impactFactorMaximum)
			: null;

		let query = sql`SELECT DISTINCT ON (LOWER("Paper Title")) * FROM public."Journal_Paper" WHERE 1=1`;
		const queryParams = [];

		const AuthorName = authorName ? authorName.toUpperCase() : null;

		if (startDate && endDate) {
			query += `
			AND TO_DATE("Year of Publication" || '-' || "Month of Publication", 'YYYY-Month') 
			BETWEEN TO_DATE($${queryParams.length + 1}, 'YYYY-MM') AND TO_DATE($${
				queryParams.length + 2
			}, 'YYYY-MM')`;

			queryParams.push(startDate);
			queryParams.push(endDate);
		}
		console.log(AuthorName);

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

		// Filter by impactFactor
		if (impactFactorMin != null && impactFactorMax != null) {
			query += ` AND "Impact Factor (Clarivate Analytics)" BETWEEN $${
				queryParams.length + 1
			} AND $${queryParams.length + 2}`;

			queryParams.push(impactFactorMin, impactFactorMax);
		}

		if (filterOption) {
			if (filterOption === "SCI") {
				query += ` AND ("IndexIn" LIKE '%Scopus%' AND "IndexIn" LIKE '%Web of Science%') 
                           AND "Impact Factor (Clarivate Analytics)" > 0`;
			} else if (filterOption === "Web of Science") {
				query += ` AND "IndexIn" LIKE $${queryParams.length + 1}`;

				queryParams.push("%Web of Science%");
			} else if (filterOption === "Other") {
				query += ` AND (("IndexIn" NOT LIKE '%Web of Science%' AND "IndexIn" NOT LIKE '%Scopus%') OR  "IndexIn" IS NULL )`;
			}
		}
		const dbName = "NirmaDB";
		const tableName = "Journal_Paper";
		await ensureDatabaseExists(dbName);

		// Reconnect to the new database
		const newPool = switchPoolToDb(dbName);
		const client = await newPool.connect();

		// Ensure table exists or create it
		await ensureTableExists(client, tableName);

		const result = await newPool.query(query, queryParams);
		// const result = await pool.query(query, queryParams);

		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "An error occurred while fetching data",
		});
	}
};
const getJournalColumns = async (req, res) => {
	try {
		// Query to fetch column names from PostgreSQL information schema
		const query = sql`SELECT * FROM public."Journal_Paper" LIMIT 1;`;
		const dbName = "NirmaDB";
		const tableName = "Journal_Paper";
		await ensureDatabaseExists(dbName);

		// Reconnect to the new database
		const newPool = switchPoolToDb(dbName);
		const client = await newPool.connect();

		// Ensure table exists or create it
		await ensureTableExists(client, tableName);
		const result = await newPool.query(query);

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

const getJournalDashboard = async (req, res) => {
	try {
		// Query for impact factor distribution
		const impactFactorQuery = sql`
            SELECT 
                SUM(CASE WHEN "Impact Factor (Clarivate Analytics)"=0 or "Impact Factor (Clarivate Analytics)" IS NULL THEN 1 ELSE 0 END) AS noIF,
                SUM(CASE WHEN "Impact Factor (Clarivate Analytics)" < 2 THEN 1 ELSE 0 END) AS lessThan2,
                SUM(CASE WHEN "Impact Factor (Clarivate Analytics)" >= 2 AND "Impact Factor (Clarivate Analytics)" < 5 THEN 1 ELSE 0 END) AS between2And5,
                SUM(CASE WHEN "Impact Factor (Clarivate Analytics)" >= 5 AND "Impact Factor (Clarivate Analytics)" < 10 THEN 1 ELSE 0 END) AS between5And10,
                SUM(CASE WHEN "Impact Factor (Clarivate Analytics)" >= 10 THEN 1 ELSE 0 END) AS greaterThanOrEqual10
            FROM 
                public."Journal_Paper";
        `;
		const dbName = "NirmaDB";
		const tableName = "Journal_Paper";
		await ensureDatabaseExists(dbName);

		// Reconnect to the new database
		const newPool = switchPoolToDb(dbName);
		const client = await newPool.connect();

		// Ensure table exists or create it
		await ensureTableExists(client, tableName);
		const resultImpactFactor = await newPool.query(impactFactorQuery);
		const counts = resultImpactFactor.rows[0];

		const impactFactorData = {
			noIF: parseInt(counts.noif, 10),
			lessThan2: parseInt(counts.lessthan2, 10),
			between2And5: parseInt(counts.between2and5, 10),
			between5And10: parseInt(counts.between5and10, 10),
			greaterThanOrEqual10: parseInt(counts.greaterthanorequal10, 10),
		};

		// Query for month-wise publication count
		const monthWiseQuery = sql`
            SELECT 
                "Year of Publication", 
                "Month of Publication", 
                COUNT(*) AS paper_count 
            FROM 
                public."Journal_Paper" 
            GROUP BY 
                "Year of Publication", "Month of Publication" 
            ORDER BY 
                "Year of Publication", 
                TO_DATE("Month of Publication", 'Month') -- Ensures correct month order
        `;

		const resultMonthWise = await newPool.query(monthWiseQuery);

		const monthWiseData = resultMonthWise.rows.map((row) => ({
			year: row["Year of Publication"],
			month: row["Month of Publication"],
			paperCount: row.paper_count,
		}));

		// Send the combined JSON response
		console.log({
			impactFactorDistribution: impactFactorData,
			monthWisePublication: monthWiseData,
		});

		res.json({
			impactFactorDistribution: impactFactorData,
			monthWisePublication: monthWiseData,
		});
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		res.status(500).json({
			error: "An error occurred while fetching dashboard data.",
		});
	}
};

export { getJournalData, getJournalColumns, getJournalDashboard };
