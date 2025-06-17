import React, { useState, useEffect } from "react";
import MovieCard from "./component/moviecard/MovieCard";

// JSON 파일은 src 밖에 있으면 import 불가. fetch로 불러와야 함!
export default function App() {
  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    fetch("/movieListData.json")
      .then(res => res.json())
      .then(data => setMovieList(data.results))
      .catch(err => console.error("데이터 불러오기 실패", err));
  }, []);

  // TMDB 이미지 경로
  const getImageUrl = (posterPath) => {
    return posterPath
      ? `https://image.tmdb.org/t/p/w500${posterPath}`
      : "https://placehold.co/300x450?text=No+Image";
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">🎬 인기 영화 모음</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {movieList.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            poster_path={getImageUrl(movie.poster_path)}
            vote_average={movie.vote_average}
          />
        ))}
      </div>
    </div>
  );
}