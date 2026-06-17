"use client";
import React, { useState, useEffect } from "react";
import Container from "../Container";
import { FiX, FiMenu } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Image from "../Image";
import logo from "/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import Cookies from "js-cookie";

const navitems = [
  { name: "Home", href: "home" },
  { name: "Features", href: "feature" },
  { name: "Pricing", href: "pricing" },
  // { name: "About us", href: "aboutUs" },
  { name: "FAQ", href: "faq" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const role = Cookies.get("role") || user?.role;
  const isSystemOwner = role === "SYSTEM_OWNER";
  const dashboardPath = isSystemOwner ? "/admin/dashboard" : "/owner/dashboard";
  const dashboardLabel = isSystemOwner ? "Admin" : "Business Owner";

  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for navbar

      navitems.forEach((item) => {
        if (!item.isRoute) {
          const section = document.getElementById(item.href);
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
              scrollPosition >= sectionTop &&
              scrollPosition < sectionTop + sectionHeight
            ) {
              setActiveSection(item.href);
            }
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const scrollToSection = (id, closeMenu = false) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (closeMenu) setOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(doScroll, 500);
    } else {
      // wait for mobile menu close animation before scrolling
      setTimeout(doScroll, closeMenu ? 350 : 0);
    }
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-[100] bg-[#ffffff] py-4 border-b border-[#e6e4df]">
      <Container>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className=" rounded-2xl shadow-sm md:border md:border-black/5 flex items-center justify-between "
        >

            <Link to="/"  onClick={() => scrollToSection("home")}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Image
               
                src={logo}
                alt="FarmCheck Logo"
                className="h-10"
              />
            </motion.div>
          </Link>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-3xl cursor-pointer p-2 rounded-xl hover:bg-slate-100 transition-colors bg-[#ffffff]"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>

          

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center justify-end gap-1 ">
            {navitems.map((item, index) => (
              <motion.li key={index} whileHover={{ y: -2 }}>
                {item.isRoute ? (
                  <Link
                    to={item.href}
                    className={`py-2 px-4 font-inter text-lg font-medium transition-colors rounded-lg bg ${
                      location.pathname === item.href
                        ? "text-[#F6A62D] "
                        : "text-slate-600 hover:text-[#F6A62D]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`py-2 px-4 font-inter text-lg font-medium transition-colors rounded-lg cursor-pointer ${
                      activeSection === item.href
                        ? "text-[#419977] "
                        : "text-white hover:text-[#419977]"
                    }`}
                  >
                    {item.name}
                  </button>
                )}
              </motion.li>
            ))}
          </ul>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:block"
          >
            {user ? (
              <Link to={dashboardPath}>
                <button className="bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] rounded-full text-white font-bold text-base px-6 py-3 border border-[#419977] cursor-pointer">
                  {dashboardLabel}
                </button>
              </Link>
            ) : (
              <Link to="/auth/login">
                <button className="bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] rounded-full text-white font-bold text-base px-6 py-3 border border-[#419977] cursor-pointer">
                  Start Free Trial
                </button>
              </Link>
            )}
          </motion.div>
        </motion.div>




        {/* Mobile Slide Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#ffffff] mt-4 rounded-2xl shadow-xl overflow-hidden"
            >
              <ul className="flex flex-col items-start gap-2 p-6">
                {navitems.map((item, index) => (
                  <motion.li
                    key={index}
                    className="w-full"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.isRoute ? (
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className={`py-3 px-4 font-inter text-lg font-medium block rounded-xl transition-all ${
                          location.pathname === item.href
                            ? "text-[#419977] bg-[#edebe5]"
                            : "text-white hover:bg-[#edebe5] hover:text-[#419977]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() => scrollToSection(item.href, true)}
                        className={`py-3 px-4 font-inter text-lg font-medium block rounded-xl transition-all w-full text-left ${
                          activeSection === item.href
                            ? "text-[#419977] bg-[#419977]/10"
                            : "text-white hover:bg-[#419977]/10 hover:text-[#419977]"
                        }`}
                      >
                        {item.name}
                      </button>
                    )}
                  </motion.li>
                ))}

                <motion.div
                  className="w-full pt-4 mt-2 border-t border-slate-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {user ? (
                    <Link to={dashboardPath} onClick={() => setOpen(false)}>
                      <button className="bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] rounded-full text-white font-bold text-base px-6 py-3 border border-[#419977] w-full cursor-pointer">
                        {dashboardLabel}
                      </button>
                    </Link>
                  ) : (
                    <Link to="/auth/login" onClick={() => setOpen(false)}>
                      <button className="bg-linear-to-t from-[#173623] via-[#0a170f] to-[#11291b] rounded-full text-white font-bold text-base px-6 py-3 border border-[#419977] w-full cursor-pointer">
                        Start Free Trial
                      </button>
                    </Link>
                  )}
                </motion.div>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default Navbar;