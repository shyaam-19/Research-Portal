import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import { ToastContainer } from "react-toastify";
import Journal from "./Pages/Journal";
import Conference from "./Pages/Conference";
import Faculty from "./Pages/Faculty";

const categories = [
    {
        name: "Journal Papers",
        href: "/categories/Journal Papers",
        element: Journal,
    },
    {
        name: "Conference Papers",
        href: "/categories/Conference Papers",
        element: Conference,
    },
    {
        name: "Book Chapters",
        href: "/categories/Book Chapters",
        element: null,
    },
    {
        name: "Projects",
        href: "/categories/Projects",
        element: null, // Update with the appropriate component when available
    },
    {
        name: "Serach Faculty",
        href: "/categories/Faculty",
        element: Faculty,
    }
];

function App() {
    return (
        <div>
            <ToastContainer />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {categories.map((category) => (
                        <Route
                            key={category.href}
                            path={category.href}
                            element={category.element ? <category.element /> : <div>Coming Soon...</div>}
                        />
                    ))}
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
