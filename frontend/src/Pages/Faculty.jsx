import React from "react";
import Navbar from "../Components/Navbar";
import LeftDrawer from "../Components/LeftDrawer";

const Faculty = () => {
    const [menu, setMenu] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState("Search Faculty");

    const toggleMenu = () => {
        setMenu(!menu);
    };

    const multiIconsRef = React.useRef(null);
    const navbarRef = React.useRef(null);
    const buttonRef = React.useRef(null);

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

    React.useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="h-screen w-full flex flex-col">
            <Navbar Menu={toggleMenu} ref={navbarRef} className="fixed top-0 left-0 w-full z-50 shadow-md bg-white" />

            <div className="flex h-full">
                {menu && (
                    <div className="fixed h-full bg-gray-50 shadow-md w-64">
                        <LeftDrawer ref={multiIconsRef} toggleCurrentPage={setCurrentPage} currentPageName={currentPage} />
                    </div>
                )}

                <div className={`flex-grow overflow-y-auto p-6 mx-auto w-full max-w-7xl transition-all duration-500 ${menu ? "ml-64" : ""}`}>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Static 3x3 Grid</h2>
                    
                    {/* 3x3 Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900">Item 1</h4>
                            <p className="text-sm text-gray-600">Description for item 1</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900">Item 2</h4>
                            <p className="text-sm text-gray-600">Description for item 2</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900">Item 3</h4>
                            <p className="text-sm text-gray-600">Description for item 3</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900">Item 4</h4>
                            <p className="text-sm text-gray-600">Description for item 4</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900">Item 5</h4>
                            <p className="text-sm text-gray-600">Description for item 5</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900">Item 6</h4>
                            <p className="text-sm text-gray-600">Description for item 6</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900">Item 7</h4>
                            <p className="text-sm text-gray-600">Description for item 7</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900">Item 8</h4>
                            <p className="text-sm text-gray-600">Description for item 8</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900">Item 9</h4>
                            <p className="text-sm text-gray-600">Description for item 9</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faculty;

// import React, { useState, useRef } from "react";
// import Navbar from "../Components/Navbar";
// import LeftDrawer from "../Components/LeftDrawer";

// const Faculty = () => {
//     const [facultyName, setFacultyName] = useState("");
//     const [menu, setMenu] = useState(false);
//     const [currentPage, setCurrentPage] = useState("Search Faculty");
//     const [scholarData, setScholarData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [publications, setPublications] = useState(null);
//     const [yearFilter, setYearFilter] = useState("");
//     const [pubLoading, setPubLoading] = useState(false);
//     const [pubError, setPubError] = useState(null);

//     const handleInputChange = (event) => {
//         setFacultyName(event.target.value);
//     };

//     const fetchPublications = async (name, year = null) => {
//         setPubLoading(true);
//         setPubError(null);
//         try {
//             const response = await fetch(`http://127.0.0.1:8000/author/publications`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ 
//                     author_name: name,
//                     year: year
//                 })
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to fetch publications');
//             }
//             const data = await response.json();
//             console.log("Publications data:", data); // Debug log
//             setPublications(data.publications || data || []); // Handle both possible response formats
//         } catch (err) {
//             setPubError(err.message);
//             console.error("Publication fetch error:", err); // Debug log
//         } finally {
//             setPubLoading(false);
//         }
//     };

//     const handleYearFilterChange = (event) => {
//         const year = event.target.value;
//         setYearFilter(year);
//         if (facultyName) {
//             fetchPublications(facultyName, year || null);
//         }
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         setLoading(true);
//         setError(null);
//         setScholarData(null);
//         setPublications(null);

//         try {
//             const response = await fetch(`http://127.0.0.1:8000/author/profile`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ author_name: facultyName })
//             });
//             if (!response.ok) {
//                 throw new Error('Faculty not found');
//             }
//             const data = await response.json();
//             setScholarData(data);
//             await fetchPublications(facultyName, yearFilter || null);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const toggleMenu = () => {
//         setMenu(!menu);
//     };

//     const multiIconsRef = useRef(null);
//     const navbarRef = useRef(null);
//     const buttonRef = useRef(null);

//     const handleClickOutside = (event) => {
//         if (
//             multiIconsRef.current &&
//             !multiIconsRef.current.contains(event.target) &&
//             navbarRef.current &&
//             !navbarRef.current.contains(event.target) &&
//             buttonRef.current &&
//             !buttonRef.current.contains(event.target)
//         ) {
//             setMenu(false);
//         }
//     };

//     React.useEffect(() => {
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     return (
//         <div className="h-screen w-full flex flex-col">
//             <Navbar Menu={toggleMenu} ref={navbarRef} className="fixed top-0 left-0 w-full z-50 shadow-md bg-white" />

//             <div className="flex h-full">
//                 {menu && (
//                     <div className="fixed h-full bg-gray-50 shadow-md w-64">
//                         <LeftDrawer ref={multiIconsRef} toggleCurrentPage={setCurrentPage} currentPageName={currentPage} />
//                     </div>
//                 )}

//                 <div className={`flex-grow overflow-y-auto p-6 mx-auto w-full max-w-7xl transition-all duration-500 ${menu ? "ml-64" : ""}`}>
//                     <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Faculty</h2>
                    
//                     {/* Search Form */}
//                     <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
//                         <div className="grid md:grid-cols-2 gap-4">
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Faculty Name</label>
//                                 <input
//                                     type="text"
//                                     value={facultyName}
//                                     onChange={handleInputChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
//                                     placeholder="Enter faculty name"
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-semibold mb-2">Filter by Year</label>
//                                 <input
//                                     type="number"
//                                     value={yearFilter}
//                                     onChange={handleYearFilterChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
//                                     placeholder="Enter year (optional)"
//                                 />
//                             </div>
//                         </div>
//                         <button
//                             type="submit"
//                             className="bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-700 py-2 px-6 rounded-md shadow-md transition-colors duration-300 font-medium"
//                             ref={buttonRef}
//                             disabled={loading}
//                         >
//                             {loading ? (
//                                 <span className="flex items-center">
//                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Searching...
//                                 </span>
//                             ) : "Search"}
//                         </button>
//                     </form>

//                     {error && (
//                         <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
//                             {error}
//                         </div>
//                     )}

//                     {/* Scholar Details Card */}
//                     {scholarData && (
//                         <div className="mt-6 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
//                             <div className="flex items-center mb-6">
//                                 <h3 className="text-2xl font-bold text-gray-800">{scholarData.name}</h3>
//                                 <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//                                     h-index: {scholarData.h_index}
//                                 </span>
//                             </div>
//                             <div className="grid md:grid-cols-2 gap-6 mb-6">
//                                 <div>
//                                     <p className="text-gray-600 text-sm">Affiliation</p>
//                                     <p className="font-medium text-gray-800">{scholarData.affiliation}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-gray-600 text-sm">Total Citations</p>
//                                     <p className="font-medium text-gray-800">{scholarData.citations}</p>
//                                 </div>
//                             </div>
//                             <div className="mb-6">
//                                 <p className="text-gray-600 text-sm mb-2">Research Interests</p>
//                                 <div className="flex flex-wrap gap-2">
//                                     {scholarData.interests.map((interest, index) => (
//                                         <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
//                                             {interest}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Publications Section */}
//                     {publications && (
//                         <div className="mt-6 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
//                             <div className="flex justify-between items-center mb-6">
//                                 <h3 className="text-xl font-bold text-gray-800">
//                                     Publications {yearFilter && `(${yearFilter})`}
//                                 </h3>
//                                 <span className="text-gray-500 text-sm">{publications.length} results</span>
//                             </div>
//                             {pubLoading ? (
//                                 <div className="flex justify-center p-8">
//                                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                                 </div>
//                             ) : pubError ? (
//                                 <p className="text-red-500 mb-4">{pubError}</p>
//                             ) : publications.length > 0 ? (
//                                 <div className="space-y-4">
//                                     {publications.map((pub, index) => (
//                                         <div 
//                                             key={index} 
//                                             className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
//                                         >
//                                             <div className="flex justify-between items-start">
//                                                 <h4 className="font-semibold text-lg text-gray-900 flex-grow">
//                                                     {index + 1}. {pub.title}
//                                                 </h4>
//                                                 {pub.container_type && (
//                                                     <div className="flex items-center space-x-2 ml-4">
//                                                         <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
//                                                             {pub.container_type}
//                                                         </span>
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             <div className="mt-3 grid md:grid-cols-3 gap-4">
//                                                 <div>
//                                                     <span className="text-sm font-medium text-gray-500">Year:</span>
//                                                     <span className="ml-2 text-gray-900">{pub.year || 'N/A'}</span>
//                                                 </div>
//                                                 <div>
//                                                     <span className="text-sm font-medium text-gray-500">Citations:</span>
//                                                     <span className="ml-2 text-gray-900">{pub.num_citations}</span>
//                                                 </div>
//                                                 <div>
//                                                     <span className="text-sm font-medium text-gray-500">Journal/Venue:</span>
//                                                     <span className="ml-2 text-gray-900">{pub.journal || 'N/A'}</span>
//                                                 </div>
//                                             </div>

//                                             {pub.abstract && pub.abstract !== 'N/A' && (
//                                                 <div className="mt-3">
//                                                     <span className="text-sm font-medium text-gray-500">Abstract:</span>
//                                                     <p className="mt-1 text-sm text-gray-600">{pub.abstract}</p>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <p className="text-gray-500 text-center py-4">No publications found</p>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Faculty;    