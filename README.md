# <img src="https://user-images.githubusercontent.com/111417360/225271417-4604cb79-33f4-44f1-b183-0912420cb3b9.png" width= "30" height = "30"/> StockBrain

<p align="center">
  StockBrain is a practical and easy-to-use investment tool that provides candlestick charts, risk-reward ratio calculators, market information, and notes-keeping features, allowing you to quickly grasp market dynamics, capture trading ideas in real-time, and achieve higher returns.
</p>


## DEMO
<p align="center">
<img src="https://user-images.githubusercontent.com/111417360/226369374-0ecf5ca5-90ce-45c5-b020-001f8b191f15.gif" width= "900" height = "550"/>
</p>

* **Website URL**：[StockBrain](https://stockbrain.web.app/)

* **Test Account**：
  + E-mail：`test@test.com `
  + Password：`test1234 `

## Table of Content
+ [Main Features](#main-features)
    + [Draw Candlestick Chart using SVG without Using Third Party Library](#draw-candlestick-chart-using-svg-without-using-third-party-library)
    + [Search Bar with Search Filter](#search-bar-with-search-filter)
    + [Tracking List](#tracking-list)
    + [Notes Keeping](#notes-keeping)
    + [Real-Time Calculator](#real-time-calculator)
    + [Member Center](#member-center)
    + [Data Validation](#data-validation)
+ [Frontend Technique](#frontend-technique)
    + React (version 18)
    + SVG (without using third party library)
    + CSS Modules
    + Third Party Library
    + [RWD](#rwd)
+ [Backend Technique](#backend-technique)
    + Firebase (version 9)
+ [Develop Tools](#develop-tools)
    + Webpack
    + Babel
    + npm
+ [Data Resource](#data-resource)
    + FinMind
+ [Version Control](#version-control)
     + Git
     + Github
+ [Contact](#contact)


## Main Features
* ##### **Draw Candlestick Chart using SVG without Using Third Party Library**
    <p>- Draw Candlestick Chart using SVG without using third party library.</p>
    <p>- Candlestick Chart with a crosshair that moves synchronously with the mouse.</p>
    <p>- Candlestick Chart with 5-day, 10-day, and 20-day moving averages, which can be displayed or hidden by clicking the button.</p>
    <p>- Hover over the candlestick with the mouse will display the corresponding stock price information.</p>
    <p align="center">
    <img src="https://user-images.githubusercontent.com/111417360/225489518-b0cb43e4-a96e-4b64-b64b-c7c48f3bc464.gif" alt="draw-candlestick-chart-with-svg-without-using-third-party-library" width= "600" height = "390"/>
</p>

* ##### **Search Bar with Search Filter**
    <p>User can input stock id or stock name to search, and the filtered search results will be displayed in real time.</p>
    <p align="center">
    <img src="https://user-images.githubusercontent.com/111417360/225492426-663dc885-1d79-4ffb-bf52-44cf99fc2f2a.gif" alt="search-bar-with-search-filter" width= "600" height = "400"/>
    </p>

* ##### **Tracking List**
    <p>User can use the "+" icon to add stock to the tracking list, click on the list item to query the candlestick chart info, or click the trash can icon to remove the item.</p>
    <p align="center">
    <img src="https://user-images.githubusercontent.com/111417360/225493429-ced0a7b3-dab6-4b07-8e14-d4891a293783.gif" width= "600" height = "400"/>
    </p>

* ##### **Notes Keeping**
    <p>User can capture trading ideas or keep notes with 4 background color options. Saved notes are editable and also can be deleted.</p>
    <p align="center">
  <img src="https://user-images.githubusercontent.com/111417360/225494117-f864d51e-cc57-44d1-a2cb-059068760fc9.gif" width= "600" height = "400"/>
</p>

* ##### **Real-Time Calculator**
    <p>- The calculation results can be displayed in real-time. By clicking the "Save" button, user can save a trading plan.</p>
    <p>- User can also click on a single trading plan in trading plan section to query the candlestick chart info.</p>
    <p>- By clicking on the stock code or risk-reward ratio column , user can sort the trading plan. </p>
    <p align="center">
    <img src="https://user-images.githubusercontent.com/111417360/225493895-1f820237-2700-4a22-98e1-551f49531e7d.gif" width= "600" height = "400"/>
    </p>

* ##### **Member Center**
    <p>User can change their nickname, password, or upload a photo.</p> 
    <p align="center">
    <img src="https://user-images.githubusercontent.com/111417360/225541472-55e41234-40f1-4bbb-8ad0-e3ecddad129c.gif" width= "600" height = "400"/>
    </p>

* ##### **Data Validation**
    <p>- Prevent special character input by using regular expressions for validation and monitoring the onPaste event to block the input of special characters.</p>
    <p>- Validate registration, login input fields, and nickname/password modification input fields using regular expressions.</p>
<p align="center">
  <img src="https://user-images.githubusercontent.com/111417360/225514199-0ea550bd-c629-4704-8f78-a9b50259367b.gif" width= "330" height = "230"/> <img src="https://user-images.githubusercontent.com/111417360/225534715-7ccc7820-c6b5-4ee1-aa8a-0b087274f2c7.gif" width= "330" height = "270"/> <img src="https://user-images.githubusercontent.com/111417360/225540535-7f8e9303-3bd9-404b-9bb1-430fbc16e645.gif" width= "330" height = "270"/> 
</p>

## Frontend Technique
* **React (version 18)**
    * React Router
        * `BrowserRouter`, `Routes`, `Route`, `useLocation`, `Link`, `useParams`, `useNavigate`
    * React Hook
        * `useState`, `useEffect`, `useRef`
    * Custom Hook
        * `useAuth`：Manage user login status.
        * `useLogIn`：Handle user login, including login with email and password, or with Google.
        * `useSignUp`：Handle user sign up.
        * `useFirestoreQuery`：Query and return data in Firebase Firestore.
        * `useUpdateDoc`：Update document in Firebase Firestore.
        * `useDeleteDoc`：Delete document in Firebase Firestore.
        
* **SVG (without third party library)**
    * SVG Path：Draw candlestick and trading volume using `<path>` element.
    * SVG Polyline：Draw 5-day, 10-day, and 20-day moving average using `<polyline>` element.
    * SVG Rect：Draw charts border using `<rect>` element.
    * SVG Line：Draw horizontal and vertical lines in chart using `<line>` element.
    * SVG Text：Draw text using `<text>` element to display information such as price, trading volume, and dates in chart.
* **CSS Modules**
    <p>Prevent the issue of styles interfering with each other.</p>
* **Third Party Library**
    * Framer Motion
        <p>Create page transition animation.</p>
        <img src="https://user-images.githubusercontent.com/111417360/225625492-a14a0fa1-160d-4219-86ad-ffe514fc1538.gif" width= "1100" height = "450"/>
        </br>
    * [node-firestore-import-export](https://github.com/jloosli/node-firestore-import-export)
        <p>Import stock data to Firestore Database.</p>
* ##### **RWD**
    <p>Create responsive layout using CSS Grid.</p>
    </br>
    <img src="https://user-images.githubusercontent.com/111417360/225548855-11775f34-8adf-45cd-b179-1e006fec4711.png" width= "1100" height = "310"/>
    <img src="https://user-images.githubusercontent.com/111417360/225549011-c1d62f63-c73c-4256-a394-c06ad9042f5a.png" width= "1100" height = "310"/>

## Backend Technique
* **Firebase (version 9)**
    * Authentication：Support email/password authentication and social media login authentication (such as Google).
    * Firestore Database：Support data storage, read and write rules setting, and query indexes creating.
    * Storage：Support member image storage.
    * Hosting：Support custom domain name and website deployment.

## Develop Tools
* **Webpack (version 5)**：Bundle JavaScript files, CSS files, images, and other resources. Resolve  issues such as browser compatibility and code compression.
* **Babel (version 9)**：Compile the code.
* **npm**：Install, manage, and update packages.

## Data Resource
* **[FinMind](https://github.com/FinMind/FinMind)**

## Version Control
* **Git**
* **GitHub**

## Contact
* Yung-Ting, Chang
* Email：hayleychangs@gmail.com
