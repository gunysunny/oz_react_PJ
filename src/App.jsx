import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieList from "./component/movielist/MovieList";
import MovieDetail from "./component/moviedetail/MovieDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/detail/:id" element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;