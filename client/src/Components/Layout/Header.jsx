import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LOGO from '../../assets/Doc_ai_logo.svg';
import { BsBell } from 'react-icons/bs';

const Header = ({ setToggleHeader }) => {
    const navigate = useNavigate();
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

    const clickToogle = () => {
        setToggleHeader((state) => !state);
    };

    const handleSettingsClick = (e) => {
        e.preventDefault();
        setShowSettingsDropdown(!showSettingsDropdown);
    };

    useEffect(() => {
        const closeDropdown = (e) => {
            if (!e.target.closest('.settings-dropdown')) {
                setShowSettingsDropdown(false);
            }
        };

        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, []);

    return (
        <>
            {/* Header Wrapper - Fixed positioning */}
            <div className="fixed top-0 left-0 right-0 z-[999]">
                {/* Primary Navigation */}
                <div className="bg-[#00599c] w-full">
                    <div className="mx-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <span
                                    className="material-symbols-outlined text-white cursor-pointer mr-4"
                                    onClick={clickToogle}
                                >
                                    menu
                                </span>
                                <img
                                    onClick={() => navigate('/')}
                                    src={LOGO}
                                    alt="Context"
                                    className="h-8 cursor-pointer"
                                />
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
                <div className="bg-[#002d62] w-full">
                    <div className="mx-8">
                        <div className="flex justify-between items-center">
                            <nav className="flex">
                                <Link to="/" className="px-1 py-3 text-white hover:bg-[#003478]">Dashboard</Link>
                                <Link to="/submission" className="ml-6 py-3 text-white hover:bg-[#003478]">Submission</Link>
                                <Link
                                    onClick={(event) => {
                                        event.preventDefault();
                                        window.open("https://www.irs.gov/businesses/small-businesses-self-employed/employment-tax-forms", "_blank");
                                    }}
                                    to="https://www.irs.gov/businesses/small-businesses-self-employed/employment-tax-forms"
                                    className="ml-6 py-3 text-white hover:bg-[#003478]"
                                >
                                    Forms & Instructions
                                </Link>
                                <Link
                                    onClick={(event) => {
                                        event.preventDefault();
                                        window.open("https://hitl-console-779369970183.us-central1.run.app/dashboard", "_blank");
                                    }}
                                    to="https://hitl-console-779369970183.us-central1.run.app/dashboard"
                                    className="ml-6 py-3 text-white hover:bg-[#003478]"
                                >
                                    HITL console
                                </Link>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer div to push content below header */}
            <div className="h-[112px]" />
        </>
    );
};

export default Header;