import React, { useEffect, useState, useRef } from "react";
import ColumnSelectorConference from "../Components/ColumnSelectorConference";
import FilterInputConference from "../Components/FilterInputConference";
import TableView from "../Components/TableView";
import {
	fetchConferenceData,
	fetchConferenceColumns,
	exportJournal,
	exportConference,
	uploadConference,
} from "../services/api.mjs";
import Navbar from "../Components/Navbar";
import LeftDrawer from "../Components/LeftDrawer";
import axios from "axios";

const Conference = () => {
	const [data, setData] = useState([]);
	const [menu, setMenu] = useState(false);
	const [displayTable, setDisplayTable] = useState(false);
	const [columns, setColumns] = useState([]);
	const [selectedColumns, setSelectedColumns] = useState([]);
	const [currentPage, setCurrentPage] = useState(null);

	const [filters, setFilters] = useState({
		startDate: "",
		endDate: "",
		authorName: "",
	});

	const toggleDisplayTable = () => {
		setDisplayTable(!displayTable);
	};

	const handleFilter = (newFilter) => {
		setFilters(newFilter);
		console.log(newFilter, "handleSubmit");
	};

	useEffect(() => {
		const fetchColumns = async () => {
			try {
				const response = await fetchConferenceColumns();
				setColumns(response.data);
				setSelectedColumns(response.data);
				console.log(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchColumns();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetchConferenceData(filters);
				console.log("api call");
				console.log(response.data);
				setData(response.data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, [filters]);

	const handleColumnChange = (newColumns) => {
		setSelectedColumns(newColumns);
	};

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
	};

	const setPage = (page) => {
		setCurrentPage(page);
	};

	const toggleMenu = () => {
		setMenu(!menu);
	};
	const multiIconsRef = useRef(null);
	const navbarRef = useRef(null);
	const buttonRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				multiIconsRef.current &&
				!multiIconsRef.current.contains(event.target) &&
				navbarRef.current &&
				!navbarRef.current.contains(event.target) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target)
			) {
				setMenu(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [multiIconsRef, navbarRef, buttonRef]);

	const exportHandlerConference = async () => {
		const exportData = {
			filters: filters,
			columns: selectedColumns,
		};
		console.log(exportData);
		const res = await exportConference(exportData);
		const url = window.URL.createObjectURL(new Blob([res.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "table_view.xlsx"); // File name
		document.body.appendChild(link);
		link.click();
		link.remove(); // Clean up the link after the download
	};

	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const importHandlerConferernce = (event) => {
		const file = event.target.files[0]; // Get the selected file
		if (!file) return;

		// Create FormData object to send the file
		const formData = new FormData();
		formData.append("file", file);
		uploadConference(formData)
			.then((response) => {
				console.log("Data uploaded successfully:", response.data);
				setSuccessMessage("File uploaded successfully!");

				// Hide message after 2 seconds
				setTimeout(() => {
					setSuccessMessage(""); // Clear the message
				}, 2000);
			})
			.catch((error) => {
				console.error("Error uploading data:", error);
				setErrorMessage(error.response.data.message);
				console.log(error.response.data.message);

				// Hide message after 2 seconds
				setTimeout(() => {
					setErrorMessage(""); // Clear the message
				}, 2000);
			});
	};

	return (
		<div className="h-screen w-full flex flex-col">
			{/* Navbar */}
			<Navbar
				Menu={toggleMenu}
				ref={navbarRef}
				className="fixed top-0 left-0 w-full z-50 shadow-md bg-white"
			/>

			{/* Content Wrapper */}
			<div className="flex h-full ">
				{/* Left Drawer */}
				{menu && (
					<div className="fixed h-full bg-gray-50 shadow-md w-64">
						<LeftDrawer
							ref={multiIconsRef}
							toggleCurrentPage={setPage}
							currentPageName={currentPage}
						/>
					</div>
				)}

				{/* Main Content */}
				<div
					className={`flex-grow overflow-y-auto p-6 mx-auto w-full transition-all duration-500 ${
						menu ? "ml-64" : ""
					}`}
				>
					{/* Filter Section */}

					<div className="flex space-x-2">
						<div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
							<h2 className="text-xl font-semibold mb-4 text-gray-700">
								Filter Conference
							</h2>
							<FilterInputConference
								onFilterChange={handleFilterChange}
							/>
							{/* <FilterInput onFilterChange={handleFilter} onColumnChangeConf={handleColumnChange}/> */}
						</div>
						<ColumnSelectorConference
							columns={columns}
							onColumnChange={handleColumnChange}
						/>
					</div>

					{/* Display Button */}
					<button
						onClick={toggleDisplayTable}
						className="bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700 py-2 px-4 rounded-md shadow-md transition-colors duration-300"
						ref={buttonRef}
					>
						{displayTable ? "Hide Records" : "Display Records"}
					</button>

					{/* Export and Import Buttons */}
					<div className="flex space-x-4 mt-4">
						<button
							onClick={exportHandlerConference}
							className="bg-green-500 text-white hover:bg-green-600 py-2 px-4 rounded-md shadow-md transition-colors duration-300"
							ref={buttonRef}
						>
							Export Table
						</button>

						{/* New Import Button */}
						<button
							onClick={() =>
								document
									.getElementById("importFileInput")
									.click()
							} // Trigger file input on button click
							className="bg-green-500 text-white hover:bg-green-600 py-2 px-4 rounded-md shadow-md transition-colors duration-300"
						>
							Import File
						</button>
						<input
							id="importFileInput"
							type="file"
							accept=".xlsx,.xls"
							onChange={importHandlerConferernce}
							style={{ display: "none" }} // Hide the file input field
						/>

						{/* Display the success message */}
						{successMessage && (
							<div className="text-green-500 mt-2">
								{successMessage}
							</div>
						)}
						{errorMessage && (
							<div className="text-red-500 mt-2">
								{errorMessage}
							</div>
						)}
					</div>

					{/* Table Section */}
					{displayTable && (
						<div className="bg-white shadow-lg rounded-lg p-6 my-10 border border-gray-200">
							{/* Record count */}
							{data.length > 0 && (
								<p className="text-gray-700 font-semibold mb-4">
									{`Total Records: ${data.length}`}
								</p>
							)}
							{data.length > 0 ? (
								<TableView
									data={data}
									selectedColumns={selectedColumns}
								/>
							) : (
								<p className="text-gray-500">
									No records found. Try adjusting the filters.
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Conference;
