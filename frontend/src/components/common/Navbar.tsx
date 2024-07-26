"use client";

import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { checkLoggedInStatus } from "../../features/authSlice";
import {
  BellIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  HomeIcon,
  FireIcon,
  UserCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import SubsIcon from "../../assets/subs.svg";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { useRouter } from "next/navigation";

type NavigationItem = {
  name: string;
  href: string;
  current: boolean;
  icon: React.ReactNode | (() => JSX.Element);
};

const navigation: NavigationItem[] = [
  {
    name: "Home",
    href: "#",
    current: true,
    icon: () => <HomeIcon className="w-5 mr-4" />,
  },
  {
    name: "Trending",
    href: "#",
    current: false,
    icon: () => <FireIcon className="w-5 mr-4" />,
  },
  {
    name: "Subscriptions",
    href: "#",
    current: false,
    icon: () => (
      <div style={{ filter: "invert(1)" }} className="mr-4">
        <SubsIcon />
      </div>
    ),
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { loading, isLoggedIn, error } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    dispatch(checkLoggedInStatus());
  }, [dispatch]);

  useEffect(() => {
    if (error || !isLoggedIn) {
      console.log("User is logged out or error occurred");
    } else {
      console.log("User is logged in");
    }
  }, [isLoggedIn, error]);

  return (
    <div className="bg-black">
      <Disclosure as={Fragment}>
        {({ open }) => (
          <>
            <div className="mx-auto sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <DisclosureButton
                  className="absolute left-0 flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Bars3Icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </DisclosureButton>

                <div className="flex items-center ml-12 sm:ml-20">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </div>

                <div className="relative ml-4 sm:ml-8 w-[50vw]">
                  <div
                    className="flex items-center rounded-[20px]"
                    style={{ boxShadow: "#838383 0 0 0px 1px" }}
                  >
                    <input
                      type="text"
                      placeholder="Search..."
                      className="block px-4 py-2 border-0 rounded-l-[20px] bg-[#121212] text-white focus:outline-none"
                      style={{ width: "calc(100% - 3.3rem)" }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center bg-[#222222] rounded-r-[20px] pl-3">
                      <MagnifyingGlassIcon className="h-5 text-white pr-3 w-10" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <a
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none"
                  >
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </a>

                  <Menu as="div" className="relative ml-3">
                    <MenuButton className="relative rounded-full  flex items-center bg-gray-800 text-sm focus:outline-none">
                      <UserCircleIcon className="h-8 w-8 rounded-full text-gray-400 hover:text-white" />
                      {!isLoggedIn && (
                        <a href="/auth/login" className="text-white px-3">
                          Sign in
                        </a>
                      )}
                    </MenuButton>
                    {isLoggedIn && (
                      <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 z-50 relative">
                          <MenuItem>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Settings
                              </a>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() => router.push("/auth/logout")}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 cursor-pointer w-full text-left"
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </MenuItem>
                        </div>
                      </MenuItems>
                    )}
                  </Menu>
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none ml-[11px]"
                  >
                    <EllipsisVerticalIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <DisclosurePanel
                className={classNames(
                  sidebarOpen ? "translate-x-0" : "-translate-x-full",
                  "transform transition-transform duration-300 ease-in-out w-[50vw] sm:w-[40vw] md:w-[20vw] absolute h-[100%] bg-black left-0 top-0 pt-14 -z-10"
                )}
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "px-3 py-2 rounded-md text-base font-medium flex items-center"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {sidebarOpen && (
                        <>
                          {typeof item.icon === "function" ? (
                            <item.icon />
                          ) : (
                            item.icon
                          )}
                          {item.name}
                        </>
                      )}
                    </a>
                  ))}
                </div>
              </DisclosurePanel>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default Navbar;
