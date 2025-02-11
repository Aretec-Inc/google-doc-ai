import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LOGO from "../../assets/opwdd_logo.png";
import { BsBell } from "react-icons/bs";

const Header = ({ setToggleHeader }) => {
  const navigate = useNavigate();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showAccessDropdown, setShowAccessDropdown] = useState(false);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const [showProvidersDropdown, setShowProvidersDropdown] = useState(false);

  const clickToogle = () => {
    setToggleHeader((state) => !state);
  };

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (!e.target.closest(".access-dropdown")) setShowAccessDropdown(false);
      if (!e.target.closest(".community-dropdown"))
        setShowCommunityDropdown(false);
      if (!e.target.closest(".providers-dropdown"))
        setShowProvidersDropdown(false);
      if (!e.target.closest(".settings-dropdown"))
        setShowSettingsDropdown(false);
    };

    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[999]">
        {/* Top utility bar */}
        <div className="bg-white border-b">
          <div className="mx-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img
                  onClick={() => navigate("/")}
                  src={LOGO}
                  alt="OPWDD Logo"
                  className="h-12 cursor-pointer mr-4"
                />
                <span className="text-sm text-gray-600">
                  An official website of New York State.
                </span>
                <button className="ml-2 text-blue-600 text-sm hover:underline">
                  Here's how you know
                </button>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <div className="relative flex items-center">
                    <button className="flex items-center gap-2 px-3 py-2 text-gray-700 border rounded">
                      <span className="material-symbols-outlined text-lg">
                        language
                      </span>
                      <span className="text-sm">Translate</span>
                      <span className="material-symbols-outlined text-sm">
                        expand_more
                      </span>
                    </button>
                  </div>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-64 px-4 py-2 text-sm border rounded bg-white focus:outline-none focus:border-blue-500"
                  />
                  <button className="absolute right-0 h-full px-3 bg-[#003478] rounded-r flex items-center justify-center">
                    <span className="material-symbols-outlined text-white">
                      search
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main header with title */}
        <div className="bg-[#461f70]">
          <div className="mx-8">
            <div className="flex items-center h-20">
              <span
                className="material-symbols-outlined text-white cursor-pointer mr-4"
                onClick={clickToogle}
              >
                menu
              </span>
              <h1 className="text-white text-2xl font-semibold">
                Office for People With Developmental Disabilities
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="bg-[#461f70] border-t border-[#5c3382]">
          <div className="mx-8">
            <nav className="flex">
              {/* Access Supports Dropdown */}
              <div className="relative access-dropdown">
                <button
                  className="px-4 py-4 text-white hover:bg-[#5c3382] flex items-center"
                  onClick={() => setShowAccessDropdown(!showAccessDropdown)}
                >
                  Access Supports
                  <span className="material-symbols-outlined ml-1 text-sm">
                    expand_more
                  </span>
                </button>
                {showAccessDropdown && (
                  <div className="absolute left-0 top-full w-64 bg-[#461f70] shadow-lg rounded-b-lg overflow-hidden">
                    <Link
                      to="/get-started"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/plan-services"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Plan Your Services
                    </Link>
                    <Link
                      to="/find-manager"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Find A Care Manager
                    </Link>
                  </div>
                )}
              </div>
              <Link
                to="/services"
                className="px-4 py-4 text-white hover:bg-[#5c3382]"
              >
                Types of Services
              </Link>
              {/* Community Involvement Dropdown */}
              <div className="relative community-dropdown">
                <button
                  className="px-4 py-4 text-white hover:bg-[#5c3382] flex items-center"
                  onClick={() =>
                    setShowCommunityDropdown(!showCommunityDropdown)
                  }
                >
                  Community Involvement
                  <span className="material-symbols-outlined ml-1 text-sm">
                    expand_more
                  </span>
                </button>
                {showCommunityDropdown && (
                  <div className="absolute left-0 top-full w-72 bg-[#461f70] shadow-lg rounded-b-lg overflow-hidden">
                    <Link
                      to="/businesses"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Information for Businesses
                    </Link>
                    <Link
                      to="/faith-based"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Information for Faith-Based Organizations
                    </Link>
                    <Link
                      to="/schools"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Information for Schools
                    </Link>
                  </div>
                )}
              </div>
              {/* Providers Dropdown */}
              <div className="relative providers-dropdown">
                <button
                  className="px-4 py-4 text-white hover:bg-[#5c3382] flex items-center"
                  onClick={() =>
                    setShowProvidersDropdown(!showProvidersDropdown)
                  }
                >
                  Providers
                  <span className="material-symbols-outlined ml-1 text-sm">
                    expand_more
                  </span>
                </button>
                {showProvidersDropdown && (
                  <div className="absolute left-0 top-full w-64 bg-[#461f70] shadow-lg rounded-b-lg overflow-hidden">
                    <Link
                      to="/service-providers"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Service Providers
                    </Link>
                    <Link
                      to="/care-management"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Care Management
                    </Link>
                    <Link
                      to="/family-care"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Family Care
                    </Link>
                    <Link
                      to="/incident-management"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Incident Management
                    </Link>
                    <Link
                      to="/training"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Training
                    </Link>
                    <Link
                      to="/choices"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      CHOICES
                    </Link>
                    <Link
                      to="/delivering-services"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Delivering Services
                    </Link>
                    <Link
                      to="/operating-information"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Operating Information
                    </Link>
                    <Link
                      to="/coronavirus"
                      className="block px-4 py-3 text-white hover:bg-[#5c3382]"
                    >
                      Coronavirus
                    </Link>
                  </div>
                )}
              </div>
              <Link
                to="/regulations"
                className="px-4 py-4 text-white hover:bg-[#5c3382]"
              >
                Regulations & Guidance
              </Link>
              <Link
                to="/about"
                className="px-4 py-4 text-white hover:bg-[#5c3382]"
              >
                About Us
              </Link>
              <Link
                to="/careers"
                className="px-4 py-4 text-white hover:bg-[#5c3382]"
              >
                Careers
              </Link>
              <Link
                to="/contacts"
                className="px-4 py-4 text-white hover:bg-[#5c3382]"
              >
                Contacts
              </Link>
              <Link
                onClick={(event) => {
                  event.preventDefault();
                  window.open(
                    "https://hitl-opwdd-779369970183.us-central1.run.app/dashboard",
                    "_blank"
                  );
                }}
                to="https://hitl-opwdd-779369970183.us-central1.run.app/dashboard"
                className="ml-6 py-3 text-white hover:bg-[#003478]"
              >
                Business Rules Console
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-[144px]" />
    </>
  );
};

export default Header;
