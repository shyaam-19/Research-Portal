
import React from 'react';

const Dashboard = ({data,dashboardData}) => {
    const papersPublished=dashboardData.monthWisePublication;
    const impactFactorDistribution=dashboardData.impactFactorDistribution;
    // const papersPublished = [
    //     { month: "July'23", count: 8 },
    //     { month: "Aug'23", count: 8 },
    //     { month: "Sep'23", count: 7 },
    //     { month: "Oct'23", count: 6 },
    //     { month: "Nov'23", count: 12 },
    //     { month: "Dec'23", count: 10 },
    //     { month: "Jan'24", count: 7 },
    //     { month: "Feb'24", count: 7 },
    //     { month: "Mar'24", count: 4 },
    //     { month: "Apr'24", count: 4 },
    //     { month: "May'24", count: 5 },
    //     { month: "June'24", count: 6 }
    // ];

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            {/* Title */}
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Research Papers Dashboard</h1>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-blue-300 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    <h2 className="text-xl font-semibold">Total Papers</h2>
                    <p className="text-4xl font-bold">{data.length}</p>
                </div>
                <div className="bg-blue-400 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    <h2 className="text-xl font-semibold">As per Clarivate Analytics</h2>
                    <div className="flex justify-between text-lg">
                        <p>Scopus: <span className="font-bold">81</span></p>
                        <p>SCIE: <span className="font-bold">60</span></p>
                        <p>ESCI: <span className="font-bold">14</span></p>
                        <p>WoS: <span className="font-bold">82</span></p>
                    </div>
                </div>
                <div className="bg-blue-500 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 col-span-1 md:col-span-2 lg:col-span-3">
                    <h2 className="text-xl font-semibold">UGC CARE</h2>
                    <p className="text-4xl font-bold">2</p>
                </div>
            </div>

            {/* Impact Factor Section */}
            <div className="bg-green-200 p-6 rounded-lg shadow-lg mb-10">
                <h2 className="text-xl font-semibold text-center">Impact Factor</h2>
                <div className="flex justify-around text-lg">
                    <p>No IF: <span className="font-bold">{impactFactorDistribution.noIF}</span></p>
                    <p>IF &lt; 2: <span className="font-bold">{impactFactorDistribution.lessThan2}</span></p>
                    <p>2 &le; IF &lt; 5: <span className="font-bold">{impactFactorDistribution.between2And5}</span></p>
                    <p>5 &le; IF &lt; 10: <span className="font-bold">{impactFactorDistribution.between5And10}</span></p>
                    <p>IF &ge; 10: <span className="font-bold">{impactFactorDistribution.greaterThanOrEqual10}</span></p>
                </div>
            </div>

            {/* Students Section */}
            <div className="bg-yellow-200 p-6 rounded-lg shadow-lg mb-10">
                <h2 className="text-xl font-semibold text-center">Students</h2>
                <div className="flex justify-around text-lg">
                    <p>UG: <span className="font-bold">28</span></p>
                    <p>PG: <span className="font-bold">7</span></p>
                    <p>PhD: <span className="font-bold">35</span></p>
                    <p>Others: <span className="font-bold">30</span></p>
                </div>
            </div>

            {/* Month-wise Papers Published Section */}
            <div className="bg-green-300 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-center">Month-wise Papers Published</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center mt-4">
                    {papersPublished.map((item, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex flex-col items-center">
                            <p className="font-semibold text-gray-700">{item.month}</p>
                            <p className="text-2xl font-bold text-gray-900">{item.paperCount}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
