import HomePage from "./components/HomePage/HomePage";
import SearchPage from "./components/SearchPage/SearchPage";
import { Route, Routes } from "react-router-dom";
import React from "react";
import RestaurentPage from "./components/RestaurentPage/RestaurentPage";
function App() {
  return (
    <>
      <main className="container-fluid">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-page/:meal_id" element={<SearchPage />} />
          <Route path="/Restaurant/:id" element={<RestaurentPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
