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


{/* Main header with title */}
<div className="bg-white border-b border-gray-200">
  <div className="mx-8">
    <div className="flex items-center h-16">
      <span
        className="material-symbols-outlined text-[#0B5487] cursor-pointer mr-4"
        onClick={clickToogle}
      >
        menu
      </span>
      <h1 className="text-[#0B5487] text-2xl font-semibold">
        Office for People With Developmental Disabilities
      </h1>
    </div>
  </div>
</div>

{/* Navigation bar */}
<div className="bg-white border-t border-gray-200">
  <div className="w-full border-b-2 border-b-[#0B5487]"> {/* Added full-width container with border */}
    <div className="mx-8">
      <nav className="flex items-center">
        <Link
          to="/regulations"
          className="px-4 py-1.5 text-[#0B5487] hover:bg-gray-50 border-r border-gray-200"
        >
          Regulations & Guidance
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
          className="px-4 py-1.5 text-[#0B5487] hover:bg-gray-50"
        >
          Business Rules Console
        </Link>
      </nav>
    </div>
  </div>
</div>

      </div>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-[88px]" />
    </>
  );
};

export default Header;
