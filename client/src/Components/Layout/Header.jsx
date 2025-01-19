// src/Components/Layout/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import LOGO from '../../assets/Doc_ai_logo.svg';
import { BsBell } from 'react-icons/bs';

const Header = ({ setToggleHeader }) => {
    const clickToogle = () => {
        setToggleHeader((state) => !state);
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            {/* Top Header */}
            <div className="bg-white border-b">
                <div className="flex justify-between items-center px-4 py-2">
                    <div className="flex items-center space-x-4">
                        <span className="material-symbols-outlined cursor-pointer" onClick={clickToogle}>
                            menu
                        </span>
                        <img src={LOGO} alt="Logo" className="h-8" />
                    </div>
                    <div className="flex items-center space-x-6">
                        <BsBell className="h-5 w-5" />
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                            <div>
                                <h6 className="text-sm">john Dae</h6>
                                <span className="text-xs text-gray-500">john@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="bg-[#00254d]">
                <nav className="flex items-center justify-between px-4">
                    <div className="flex">
                        <Link to="/file" className="px-6 py-3 text-white hover:bg-blue-800">File</Link>
                        <Link to="/submission" className="px-6 py-3 text-white hover:bg-blue-800">Submission</Link>
                        <Link to="/forms" className="px-6 py-3 text-white hover:bg-blue-800">Forms & Instructions</Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/help" className="text-white hover:text-gray-300">Help Assistant</Link>
                        <Link to="/learn" className="text-white hover:text-gray-300">Learn</Link>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;