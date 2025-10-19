import React, { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 cursor-pointer group">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                Eato
                            </h1>
                            <span className="text-3xl ml-1 group-hover:scale-110 transition-transform duration-300">
                                🍽️
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <ul className="hidden md:flex space-x-8">
                        <li>
                            <a
                                href="/"
                                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300 relative group"
                            >
                                Home
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/menu"
                                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300 relative group"
                            >
                                Menu
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/about"
                                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300 relative group"
                            >
                                About
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/contact"
                                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-300 relative group"
                            >
                                Contact
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                    </ul>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Search Box */}
                        <div className="relative">
                            <button
                                onClick={toggleSearch}
                                className="text-gray-600 hover:text-orange-500 transition-colors duration-300 p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Search Dropdown */}
                            {isSearchOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-3 border border-gray-200">
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Search for burgers, pizza, cakes..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            autoFocus
                                        />
                                        <button className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600 transition-colors duration-300">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <div className="relative">
                            <button className="relative text-gray-600 hover:text-orange-500 transition-colors duration-300 p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    0
                                </span>
                            </button>
                        </div>

                        {/* Login Button */}
                        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                            Login
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-orange-500 focus:outline-none transition-colors duration-300"
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-4 pt-2 pb-4 space-y-3 bg-gray-50 shadow-inner">
                    {/* Mobile Navigation Links */}
                    <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-500 rounded-lg transition-colors duration-300">
                        Home
                    </a>
                    <a href="/menu" className="block px-4 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-500 rounded-lg transition-colors duration-300">
                        Menu
                    </a>
                    <a href="/about" className="block px-4 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-500 rounded-lg transition-colors duration-300">
                        About
                    </a>
                    <a href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-500 rounded-lg transition-colors duration-300">
                        Contact
                    </a>

                    {/* Mobile Search */}
                    <div className="pt-3">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search food..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <button className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600 transition-colors duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Cart & Login */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-500 rounded-lg transition-colors duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Cart</span>
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">0</span>
                        </button>

                        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;