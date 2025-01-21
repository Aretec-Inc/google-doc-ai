import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LOGO from '../../assets/Doc_ai_logo.svg';
import { BsBell } from 'react-icons/bs';

const Header = ({ setToggleHeader }) => {
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

    const clickToogle = () => {
        setToggleHeader((state) => !state);
    };

    const handleSettingsClick = (e) => {
        e.preventDefault();
        setShowSettingsDropdown(!showSettingsDropdown);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
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
            <div className="bg-[#002d62] w-full">
                <div className="mx-8">
                    <div className="flex justify-between items-center">
                        <nav className="flex">
                            <Link to="/" className="px-1 py-3 text-white hover:bg-[#003478]">Dashboard</Link>
                            <Link to="/submission" className="pl-6 py-3 text-white hover:bg-[#003478]">Submission</Link>
                            <Link
                                onClick={(event) => {
                                    event.preventDefault();
                                    window.open("https://www.irs.gov/businesses/small-businesses-self-employed/employment-tax-forms", "_blank");
                                }}
                                to="https://www.irs.gov/businesses/small-businesses-self-employed/employment-tax-forms"
                                className="pl-6 py-3 text-white hover:bg-[#003478]">
                                Forms & Instructions</Link>
                            <div className="settings-dropdown relative">
                                <button
                                    onClick={handleSettingsClick}
                                    className="pl-6 py-3 text-white hover:bg-[#003478] flex items-center"
                                >
                                    Settings
                                    <span className="material-symbols-outlined ml-1 text-sm">
                                        {showSettingsDropdown ? 'expand_less' : 'expand_more'}
                                    </span>
                                </button>
                                {showSettingsDropdown && (
                                    <div
                                        className="absolute top-full left-0 bg-[#002d62] border border-[#003478] min-w-[200px] z-50"
                                        style={{
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                                            clipPath: 'inset(-20px -20px 0 -20px)'
                                        }}
                                    >
                                        <Link
                                            to="/business-rules"
                                            className="flex items-center pl-6 py-3 text-white hover:bg-[#003478] transition-colors duration-150 border-t border-[#003478] group"
                                            onClick={() => setShowSettingsDropdown(false)}
                                        >
                                            <span className="material-symbols-outlined mr-2 text-sm opacity-80 group-hover:opacity-100">
                                                rule
                                            </span>
                                            Business Rules
                                        </Link>
                                    </div>
                                )}
                            </div>
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
        </>
    );
};

export default Header;