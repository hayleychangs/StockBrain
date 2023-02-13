import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainPage from "./pages/MainPage/mainPage";
import HomePage from "./pages/HomePage/homePage";
import { Auth } from "./pages/Auth/auth";
import { LogIn } from "./pages/LogIn/logIn";
import { SignUp } from "./pages/SignUp/signUp";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={ <MainPage /> } />
                <Route path="/home/:stockId" element={ <MainPage /> } />
                <Route path="/" element={ <HomePage /> } />
                <Route path="/auth" element={ <Auth /> } />
                <Route path="/login" element={ <LogIn /> } />
                <Route path="/signup" element={ <SignUp /> } />
            </Routes>               
        </BrowserRouter>
    )
}

export default App;