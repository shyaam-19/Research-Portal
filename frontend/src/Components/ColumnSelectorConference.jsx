// import React from "react";

// const ColumnSelectorConference = ({
// 	columns,
// 	selectedColumns,
// 	onColumnChange,
// }) => {
// 	const handleChange = (e) => {
// 		const { value, checked } = e.target;
// 		if (checked) {
// 			onColumnChange([...selectedColumns, value]);
// 		} else {
// 			onColumnChange(selectedColumns.filter((col) => col !== value));
// 		}
// 	};

// 	return (
// 		<div className="flex flex-wrap space-x-2">
// 			{columns.map((column) => (
// 				<label key={column} className="flex items-center">
// 					<input
// 						type="checkbox"
// 						value={column}
// 						checked={selectedColumns.includes(column)}
// 						onChange={handleChange}
// 						className="mr-2"
// 					/>
// 					{column}
// 				</label>
// 			))}
// 		</div>
// 	);
// };

// export default ColumnSelectorConference;



import React, { useState, useEffect } from "react";
import { AiOutlineDown } from "react-icons/ai"; // Importing an arrow icon from react-icons

const ColumnSelector = ({ columns, onColumnChange }) => {
	const [selectedColumns, setSelectedColumns] = useState(columns);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (columns.length > 0) {
			setSelectedColumns(columns); // Set selectedColumns to the full columns array
		}
	}, [columns]); // Effect will run whenever columns prop changes

	const handleCheckboxChange = (event) => {
		const { name, checked } = event.target;
		const updatedColumns = checked
			? [...selectedColumns, name]
			: selectedColumns.filter((column) => column !== name);
		setSelectedColumns(updatedColumns);
		onColumnChange(updatedColumns); // Notify parent about column changes
	};

	const toggleDropdown = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<div className="z-20">
			<button
				onClick={toggleDropdown}
				className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md mb-4 transition duration-300 hover:bg-blue-700"
			>
				Select Columns
				<AiOutlineDown
					className={`ml-2 transform transition-transform duration-300 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen && (
				<div className=" z-10 bg-white shadow-lg border border-gray-300 rounded-md max-h-[220px] overflow-y-auto transition-all duration-300 ease-in-out">
					<h3 className="text-lg font-semibold p-4 border-b">
						Select Columns to Display
					</h3>
					<div className="grid grid-cols-1 gap-2 p-4">
						{columns.map((column) => (
							<div
								key={column}
								className="flex items-center hover:bg-gray-100 transition duration-200 rounded-md p-2"
							>
								<label className="inline-flex items-center">
									<input
										type="checkbox"
										name={column}
										checked={selectedColumns.includes(
											column
										)}
										onChange={handleCheckboxChange}
										className="mr-2 form-checkbox text-blue-600 focus:ring focus:ring-blue-300 rounded" // Custom checkbox styling
									/>
									<span className="text-gray-800">
										{column}
									</span>
								</label>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ColumnSelector;



