import React, { useState, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "/logo.png";
import { GiHamburgerMenu } from "react-icons/gi";

const categories = [
	{
		name: "Conference Papers",
		href: "/categories/Conference Papers",
	},
	{
		name: "Journal Papers",
		href: "/categories/Journal Papers",
	},
	{
		name: "Book Chapters",
		href: "/categories/Book Chapters",
	},
	{
		name: "Projects",
		href: "/categories/Projects",
	},
];

const Navbar = forwardRef(({ Menu }, navbarRef) => {
	const navigate = useNavigate();
	const handleLogout = () => {
		toast.success("Logged out successfully!", {
			position: "top-right",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			onClose: () => {
				localStorage.setItem("login", "false");
				localStorage.removeItem("login_user");
				navigate("/");
			},
		});
	};
	const handleMouseEnter = () => {
		setDropdown(true);
	};
	const handleMouseLeave = () => {
		setDropdown(false);
	};

	const [dropdown, setDropdown] = useState(false);
	return (
			<div
				className="relative w-full bg-white flex justify-between border-b z-10"
				ref={navbarRef}
			>
				<div className=" flex max-w-7xl items-center justify-between px-13 py-1 sm:px-4 lg:px-5 ">
					<button
						className="inline-flex items-center space-x-2 text-2xl hover:border hover:rounded-full p-2 hover:bg-slate-300 hover:cursor-pointer"
						onClick={Menu}
					>
						<GiHamburgerMenu />
					</button>
					<div className="inline-flex items-center space-x-2 ml-4">
						<Link
							to="/"
							className="flex font-bold items-center text-xl hover:cursor-pointer hover:border-black hover:border-[1px] rounded-[8px]  p-1  border-transparent border-[1px]"
						>
							Nirma University
							<img className="h-8 " src={logo} alt="logo" />
						</Link>
					</div>
				</div>
				<div className="flex max-w-7xl items-center justify-between  px-3 py-2 sm:px-4 lg:px-5 ">
					<div className="hidden grow items-start lg:flex justify-center">
						<ul className="ml-12 inline-flex space-x-8">
							<li
								className="text-md font-semibold text-gray-800 hover:text-orange-500 mr-2 flex items-center cursor-pointer relative"
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
							>
								Categories{" "}
								<svg
									width="15"
									height="15"
									viewBox="0 0 15 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className={` h-[20px] w-[20px] stroke-current stroke-[1px]   relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180  group-data-[state=open]:opacity-100 ${
										dropdown === true ? "rotate-180" : ""
									}`}
									aria-hidden="true"
								>
									<path
										d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
										fill="currentColor"
										fillRule="evenodd"
										clipRule="evenodd"
									></path>
								</svg>
								{dropdown && (
									<div className="absolute top-6 -left-5 py-2 w-max  bg-white rounded-lg shadow-lg z-10">
										<ul>
											{categories.map((category, key) => (
												<li key={key}>
													<Link
														to={category.href}
														className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
													>
														{category.name}
													</Link>
												</li>
											))}
										</ul>
									</div>
								)}
							</li>
						</ul>
					</div>
				</div>
				<div className="flex max-w-7xl items-center justify-between  px-3 py-2 sm:px-4 lg:px-5">
					{/* {localStorage.getItem("login") === null ||
					localStorage.getItem("login") === "false" ? (
						<div className="hidden space-x-2 lg:block">
							<Link to={"/Signup"}>
								<button
									type="button"
									className="rounded-md border border-black  bg-transparent px-3 py-2 text-sm font-semibold text-black hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
								>
									Sign Up
								</button>
							</Link>
							<Link to={"/"}>
								<button
									type="button"
									className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black hover:bg-green-500"
								>
									Sign In
								</button>
							</Link>
						</div>
					) : (
						<div className="hidden space-x-2 lg:flex  lg:relative lg:items-center">
							
							<button
								type="button"
								onClick={handleLogout}
								className="rounded-md border border-black  bg-transparent px-3 py-2 text-sm font-semibold text-black hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
							>
								Log Out
							</button>
							
						</div>
					)} */}
				</div>
			</div>

	);
});
Navbar.displayName = "Navbar"; // Ensure display name is set

export default Navbar;
