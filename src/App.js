import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainPage from "./pages/MainPage/mainPage";
import HomePage from "./pages/HomePage/homePage";
import { Auth } from "./pages/Auth/auth";
import { LogIn } from "./pages/LogIn/logIn";
import { SignUp } from "./pages/SignUp/signUp";
import MemberSettings from "./pages/MemberSetting/memberSettings";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={ <MainPage /> } exact/>
                <Route path="/home/:stockId" element={ <MainPage /> } exact/>
                <Route path="/" element={ <HomePage /> } exact/>
                <Route path="/auth" element={ <Auth /> } />
                <Route path="/login" element={ <LogIn /> } exact/>
                <Route path="/signup" element={ <SignUp /> } exact/>
                <Route path="/myaccount" element={ <MemberSettings /> } exact/>
            </Routes>               
        </BrowserRouter>
    )
}

export default App;