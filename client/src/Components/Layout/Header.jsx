import React from 'react';
import { Link } from 'react-router-dom';
import LOGO from '../../assets/Doc_ai_logo.svg';
import { BsBell } from 'react-icons/bs';

const Header = ({ setToggleHeader }) => {
    const clickToogle = () => {
        setToggleHeader((state) => !state);
    };

    return (
        <>
            {/* Primary Navigation */}
            <div className="bg-[#002D62] w-full">
                <div className="mx-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <span 
                                className="material-symbols-outlined text-white cursor-pointer mr-4" 
                                onClick={clickToogle}
                            >
                                menu
                            </span>
                            <img src={LOGO} alt="Context" className="h-8" />
                        </div>
                        <div className="flex items-center space-x-6 text-white">
                            <Link to="/help" className="text-sm hover:text-gray-200">Help</Link>
                            <Link to="/news" className="text-sm hover:text-gray-200">News</Link>
                            <div className="flex items-center space-x-1">
                                <span className="text-sm">English</span>
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <BsBell className="h-5 w-5" />
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                    <div>
                                        <div className="text-sm">john@gmail.com</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Navigation */}
            <div className="bg-[#00254d] w-full">
                <div className="mx-8">
                    <div className="flex justify-between items-center">
                        <nav className="flex">
                            <Link to="/file" className="px-1 py-3 text-white hover:bg-[#003478]">File</Link>
                            <Link to="/submission" className="px-6 py-3 text-white hover:bg-[#003478]">Submission</Link>
                            <Link to="/forms" className="px-6 py-3 text-white hover:bg-[#003478]">Forms & Instructions</Link>
                        </nav>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Search" 
                                    className="py-1 px-3 pr-8 rounded text-sm w-64"
                                />
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">
                                    search
                                </span>
                            </div>
                            <Link to="/help" className="text-white hover:text-gray-200">Help Assistant</Link>
                            <Link to="/learn" className="text-white hover:text-gray-200">Learn</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;