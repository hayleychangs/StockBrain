import React from "react";
import { BrowserRouter } from "react-router-dom";

import AnimateRoutes from "./pages/AnimateRoutes/AnimateRoutes";

function App(){
    
    return(
        <BrowserRouter>
            <AnimateRoutes />        
        </BrowserRouter>
    )
}

export default App;