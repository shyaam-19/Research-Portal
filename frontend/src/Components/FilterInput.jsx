import React, { useEffect, useState } from "react";
import ColumnSelector from "./ColumnSelector";
import { fetchJournalColumns } from "../services/api.mjs";

function FilterInput({ onFilterChange}) {
	const [filters, setFilters] = useState({
		startDate: "",
		endDate: "",
		authorName: "",
		impactFactorMinimum: "",
		impactFactorMaximum: "",
		// impactFactorMin: 0,
		// impactFactorMax: 0.1,
		filterOption: "", // Stores the selected radio option
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		const processedValue =
			name === "impactFactorMinimum" || name === "impactFactorMaximum"
				? parseFloat(value) || 0 // Convert to float and handle empty values
				: value;
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: processedValue,
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(filters, "handleSubmit");
		onFilterChange(filters);
	};

	const clearFilter = () => {
		setFilters({
			startDate: "",
			endDate: "",
			authorName: "",
			impactFactorMinimum: "",
			impactFactorMaximum: "",
			// impactFactorMin: 0,
			// impactFactorMax: 0.1,
			filterOption: "",
		});

		// onFilterChange({});
		onFilterChange({
			startDate: "",
			endDate: "",
			authorName: "",
			impactFactorMinimum: "",
			impactFactorMaximum: "",
			// impactFactorMin: 0,
			// impactFactorMax: 0.1,
			filterOption: "",
		});
	};
	
	return (
		<div className="border mt-10 p-4 w-full">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-wrap justify-around space-x-4 container items-center w-full">
					<div className="flex flex-col items-end space-y-1">
						<div>
							<label
								htmlFor="startDate"
								className="mr-1 font-semibold text-lg"
							>
								Start Date:
							</label>
							<input
								type="month"
								name="startDate"
								value={filters.startDate}
								onChange={handleInputChange}
								className="border p-2 rounded-sm"
							/>
						</div>

						<div>
							<label
								htmlFor="endDate"
								className="mr-1 font-semibold text-lg"
							>
								End Date:
							</label>
							<input
								type="month"
								name="endDate"
								value={filters.endDate}
								onChange={handleInputChange}
								className="border p-2 rounded-sm"
							/>
						</div>
					</div>
					<div className="flex flex-col items-start space-y-1">
						<div>
							<label
								htmlFor="authorName"
								className="mr-1 font-semibold text-lg"
							>
								Author Name:
							</label>
							<input
								type="text"
								name="authorName"
								placeholder="Author Name"
								value={filters.authorName}
								onChange={handleInputChange}
								className="border p-2 rounded-sm"
							/>
						</div>

						<div className="flex justify-between items-center">
							<label
								htmlFor="impactFactor"
								className="mr-1 font-semibold text-lg"
							>
								Impact Factor:
							</label>
							<div className="flex justify-center items-center space-x-2">
								<input
									type="number"
									name="impactFactorMinimum"
									min="0"
									max="10"
									step="0.1"
									value={filters.impactFactorMinimum}
									onChange={handleInputChange}
									placeholder="Min"
									className="border p-2 rounded-sm max-w-fit"
								/>
								<span className="mr-1 font-semibold text-lg">
									To
								</span>
								{/* <span className="font-semibold">to</span> */}
								<input
									type="number"
									name="impactFactorMaximum"
									min="0"
									max="10"
									step="0.1"
									value={filters.impactFactorMaximum}
									onChange={handleInputChange}
									placeholder="Max"
									className="border p-2 rounded-sm max-w-fit"
								/>
							</div>
						</div>
					</div>
					<div>
						<label
							htmlFor="impactFactor"
							className="mr-1 font-semibold text-lg"
						>
							Indexing
						</label>
						<div className="flex flex-col  items-start ">
							<label className="cursor-pointer">
								<input
									type="radio"
									name="filterOption"
									value="SCI"
									checked={filters.filterOption === "SCI"}
									onChange={handleInputChange}
									className="mr-2 cursor-pointer"
								/>
								SCI
							</label>
							<label className="cursor-pointer">
								<input
									type="radio"
									name="filterOption"
									value="WOS"
									checked={filters.filterOption === "WOS"}
									onChange={handleInputChange}
									className="mr-2 cursor-pointer"
								/>
								Web of Science
							</label>
							<label className="cursor-pointer">
								<input
									type="radio"
									name="filterOption"
									value="other"
									checked={filters.filterOption === "other"}
									onChange={handleInputChange}
									className="mr-2 cursor-pointer"
								/>
								Other
							</label>
							<label className="cursor-pointer">
								<input
									type="radio"
									name="filterOption"
									value=""
									checked={filters.filterOption === ""}
									onChange={handleInputChange}
									className="mr-2 cursor-pointer"
								/>
								NONE
							</label>
						</div>
					</div>
					<div className="grid row-span-2 space-y-2">
						<button
							type="submit"
							className="bg-blue-500 text-white px-2 max-h-max py-1 w-32  rounded-[4px]"
						>
							Submit
						</button>
						<button
							type="button"
							className="bg-orange-600 text-white px-2 items-center max-h-max py-1 w-32  rounded-[4px]"
							onClick={clearFilter}
						>
							Clear Filters
						</button>
					</div>
				</div>
			</form>
			
		</div>
	);
}

export default FilterInput;

