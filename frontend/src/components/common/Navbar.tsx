"use client";

import {
  BellIcon,
  XMarkIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Fragment, useState } from "react";

const navigation = [
  { name: "Home", href: "#", current: true },
  { name: "Trending", href: "#", current: false },
  { name: "Subscriptions", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-black">
      <Disclosure as={Fragment}>
        {({ open }) => (
          <>
            <div className="mx-auto sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <DisclosureButton
                  className="absolute left-0 flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? (
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  ) : (
                    <Bars3Icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  )}
                </DisclosureButton>

                <div className="flex items-center ml-4 sm:ml-20">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </div>

                <div className="relative ml-4 sm:ml-8 w-[50vw]">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="block px-4 py-2 border-0 rounded-l-[20px] bg-[#121212] text-white focus:outline-none"
                      style={{ width: "calc(100% - 3.3rem)" }} // Adjust width here
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center bg-[#222222] rounded-r-[20px] pl-3">
                      <MagnifyingGlassIcon className="h-5 text-white pr-3 w-10" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <Menu as="div" className="relative ml-3">
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="h-8 w-8 rounded-full"
                      />
                    </MenuButton>
                    <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1">
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
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                </div>
              </div>

              <DisclosurePanel
                className={classNames(
                  sidebarOpen ? "translate-x-0" : "-translate-x-full",
                  "transform transition-transform duration-300 ease-in-out w-fit sm:w-[40vw] lg:w-[20vw] absolute h-[100%] bg-black left-0 top-0 pt-14 -z-10"
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
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
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
}
