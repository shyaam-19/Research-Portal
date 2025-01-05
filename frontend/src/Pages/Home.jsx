import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import LeftDrawer from "../Components/LeftDrawer";
import TableView from "../Components/TableView";
import { fetchJournal } from "../services/api.mjs"; // Import functions for all data types

function Home() {
	const [menu, setMenu] = useState(false);
	const [filter, setFilter] = useState(true);
	const [currentPage, setCurrentPage] = useState(null);
	const [data, setData] = useState([]);

	// State for filter form inputs
	const [startDate, setStartDate] = useState(""); // e.g., "2024-08"
	const [endDate, setEndDate] = useState(""); // e.g., "2024-12"
	const [authorName, setAuthorName] = useState("");
	const [impactFactor, setImpactFactor] = useState(0);

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		// Call API with all filters, including author name and impact factor
		const response = await fetchJournal({
			startDate,
			endDate,
			authorName,
			impactFactor,
		});

		// Update data with filtered results
		setData(response.data);
		console.log("Filtered data:", response.data);
	};

	const handleFilter = async () => {
		console.log("Applying Filters");
		console.log("Start Date:", startDate, "End Date:", endDate);
		const response = await fetchJournal({
			startDate,
			endDate,
			authorName,
			impactFactor,
		});

		setData(response.data);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetchJournal();
				console.log(response.data);
				setData(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, []);

	const setPage = (page) => {
		setCurrentPage(page);
	};

	const toggleMenu = () => {
		setMenu(!menu);
	};

	const multiIconsRef = useRef(null);
	const navbarRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				multiIconsRef.current &&
				!multiIconsRef.current.contains(event.target) &&
				navbarRef.current &&
				!navbarRef.current.contains(event.target)
			) {
				setMenu(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [multiIconsRef, navbarRef]);

	return (
		<div className="h-full w-full">
			<Navbar Menu={toggleMenu} ref={navbarRef}></Navbar>
			<div className="h-full w-full flex justify-around relative">
				{/* Left Aligned Drawer */}
				{menu && (
					<LeftDrawer
						ref={multiIconsRef}
						toggleCurrentPage={setPage}
						currentPageName={currentPage}
						className="bg-gray-50 mr-10 left-0 absolute"
					></LeftDrawer>
				)}
				<div className="w-[400px] h-[500px]">Home Page	</div>
			</div>
		</div>
	);
}

export default Home;
