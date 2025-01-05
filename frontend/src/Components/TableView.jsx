const TableView = ({ data, selectedColumns }) => {
	console.log(selectedColumns);
	
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200 overflow-y-auto max-h-[400px] block ">
				<thead className="bg-gray-50 sticky top-0 z-10 ">
					<tr>
						{selectedColumns.length > 0 &&
							selectedColumns.map((key) => (
								<th
									key={key}
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-32"
								>
									{key}
								</th>
							))}
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200 ">
					{data.map((row, index) => (
						<tr key={index}>
							{selectedColumns.map((column, idx) => {
								const value = row[column];								
								const stringValue =
									value === null ? "N/A" : String(value);
								return (
									<td
										key={idx}
										className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 break-words max-w-72   ${
											stringValue.length > 40
												? "text-wrap"
												: ""
										}`}
									>
										{stringValue}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TableView;



// const TableView = ({ data }) => (
// 	<div className="overflow-x-auto">
// 		<table className="min-w-full divide-y divide-gray-200 overflow-y-auto max-h-[400px] block ">
// 			<thead className="bg-gray-50 sticky top-0 z-10 ">
// 				<tr>
// 					{data.length > 0 &&
// 						Object.keys(data[0]).map((key) => (
// 							<th
// 								key={key}
// 								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-32"
// 							>
// 								{key}
// 							</th>
// 						))}
// 				</tr>
// 			</thead>
// 			<tbody className="bg-white divide-y divide-gray-200 ">
// 				{data.map((row, index) => (
// 					<tr key={index}>
// 						{Object.values(row).map((value, idx) => {
// 							const stringValue =
// 								value === null ? "N/A" : String(value);
// 							return (
// 								<td
// 									key={idx}
// 									className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 break-words max-w-72   ${
// 										stringValue.length > 40
// 											? "text-wrap"
// 											: ""
// 									}`}
// 								>
// 									{stringValue}
// 								</td>
// 							);
// 						})}
// 					</tr>
// 				))}
// 			</tbody>
// 		</table>
// 	</div>
// );

// export default TableView;




