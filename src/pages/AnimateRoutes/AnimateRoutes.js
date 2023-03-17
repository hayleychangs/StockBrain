import  React from "react";
import {Route, Routes, useLocation } from "react-router-dom";

import MainPage from "../MainPage/mainPage";
import HomePage from "../HomePage/homePage";
import { LogIn } from "../LogIn/logIn";
import { SignUp } from "../SignUp/signUp";
import MemberSettings from "../MemberSetting/memberSettings";
import About from "../About/about";
import Contact from "../Contact/contact";

import { AnimatePresence } from "framer-motion";

function AnimateRoutes () {
    const location = useLocation();
    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                <Route path="/home" element={ <MainPage /> } exact/>
                <Route path="/home/:stockId" element={ <MainPage /> } exact/>
                <Route path="/" element={ <HomePage /> } exact/>
                <Route path="/login" element={ <LogIn /> } exact/>
                <Route path="/signup" element={ <SignUp /> } exact/>
                <Route path="/myaccount" element={ <MemberSettings /> } exact/>
                <Route path="/about" element={ <About /> } exact/>
                <Route path="/contact" element={ <Contact /> } exact/>
            </Routes>
        </AnimatePresence>
    )
};
export default AnimateRoutes;