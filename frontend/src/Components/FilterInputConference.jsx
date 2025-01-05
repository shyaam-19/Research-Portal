import React, { useState } from "react";


function FilterInputConference({ onFilterChange }) {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    authorName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const clearFilter = () => {
    setFilters({
      startDate: "",
      endDate: "",
      authorName: "",
      // filterOption: "",
    });
    onFilterChange({
      startDate: "",
      endDate: "",
      authorName: "",
      // filterOption: "",
    });
  };

  return (
    <div className="border mt-10 p-4 w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap justify-around space-x-4 container items-center w-full">
          <div className="flex flex-col items-end space-y-1">
            <div>
              <label htmlFor="startDate" className="mr-1 font-semibold text-lg">
                Start Date:
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleInputChange}
                className="border p-2 rounded-sm"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="mr-1 font-semibold text-lg">
                End Date:
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleInputChange}
                className="border p-2 rounded-sm"
              />
            </div>
          </div>
          <div className="flex flex-col items-start space-y-1">
            <div>
              <label htmlFor="authorName" className="mr-1 font-semibold text-lg">
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
            {/* <div>
              <label htmlFor="filterOption" className="mr-1 font-semibold text-lg">
                Indexing:
              </label>
              <select
                name="filterOption"
                value={filters.filterOption}
                onChange={handleInputChange}
                className="border p-2 rounded-sm"
              >
                <option value="">NONE</option>
                <option value="SCI">SCI</option>
                <option value="WOS">Web of Science</option>
                <option value="other">Other</option>
              </select>
            </div> */}
          </div>
          <div className="grid row-span-2 space-y-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-2 max-h-max py-1 w-32 rounded-[4px]"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-orange-600 text-white px-2 items-center max-h-max py-1 w-32 rounded-[4px]"
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

export default FilterInputConference;
