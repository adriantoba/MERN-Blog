import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  HiArrowSmRight,
  HiDocument,
  HiDocumentText,
  HiUser,
  HiOutlineUserGroup,
  HiX,
  HiMenu,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";

export default function DashSidebar() {
  const location = useLocation();
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative md:h-screen">
      <div className="flex flex-col items-center mx-auto z-40">
        <button
          className={`md:hidden p-2 text-gray-500 focus:outline-none transition-transform duration-300 ${
            isSidebarOpen ? "translate-y-100" : ""
          }`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>
      <Sidebar
        className={`fixed top-0 left-0 z-50 w-full h-auto shadow-lg transform transition-transform duration-300 md:relative md:translate-y-0 ${
          isSidebarOpen ? "translate-y-0" : "-translate-y-full"
        } md:h-full`}
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap 1 ">
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                active={tab === "profile"}
                as="div"
                icon={HiUser}
                label={currentUser.isAdmin ? "Admin" : "User"}
                labelColor="dark"
                onClick={toggleSidebar}
              >
                Profile
              </Sidebar.Item>
            </Link>
            {currentUser.isAdmin && (
              <>
                <Link to="/dashboard?tab=posts">
                  <Sidebar.Item
                    active={tab === "posts"}
                    icon={HiDocumentText}
                    as="div"
                    onClick={toggleSidebar}
                  >
                    Posts
                  </Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=drafts">
                  <Sidebar.Item
                    active={tab === "drafts"}
                    icon={HiDocument}
                    as="div"
                    onClick={toggleSidebar}
                  >
                    Drafts
                  </Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=users">
                  <Sidebar.Item
                    active={tab === "users"}
                    icon={HiOutlineUserGroup}
                    as="div"
                    onClick={toggleSidebar}
                  >
                    Users
                  </Sidebar.Item>
                </Link>

                <Link to="/dashboard?tab=comments">
                  <Sidebar.Item
                    active={tab === "comments"}
                    icon={HiOutlineUserGroup}
                    as="div"
                    onClick={toggleSidebar}
                  >
                    Comments
                  </Sidebar.Item>
                </Link>
              </>
            )}
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
