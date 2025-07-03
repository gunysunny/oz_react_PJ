import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSupabaseAuth } from "../supabase/auth/index.js";

import MovieList from "./component/movielist/MovieList";
import MovieDetail from "./component/moviedetail/MovieDetail";
import Layout from "./component/layout/Layout";
import Signup from "./component/pages/Signup";
import Login from "./component/pages/Login";

function App() {
  const { getUserInfo } = useSupabaseAuth();

  useEffect(() => {
    getUserInfo(); // 마운트 시 유저 정보 갱신 (localStorage 저장)
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MovieList />} />
          <Route path="detail/:id" element={<MovieDetail />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;