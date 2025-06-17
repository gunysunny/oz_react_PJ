import React, { useState, useEffect } from "react";
import MovieCard from "../moviecard/MovieCard";
import { useNavigate } from "react-router-dom";

function MovieList() {
    const [movieList, setMovieList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/movieListData.json")
        .then(res => res.json())
        .then(data => setMovieList(data.results))
        .catch(err => console.error("데이터 불러오기 실패", err));
    }, []);

    const getImageUrl = (posterPath) =>
        posterPath
        ? `https://image.tmdb.org/t/p/w500${posterPath}`
        : "https://placehold.co/300x450?text=No+Image";

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <h1 className="text-3xl font-bold text-center mb-8">🎬 인기 영화 모음</h1>
            <div className="flex flex-wrap justify-center gap-6 w-full max-w-none min-w-0">
                {movieList.map((movie) => (
                <div
                    key={movie.id}
                    onClick={() => navigate(`/detail/${movie.id}`)}
                    className="cursor-pointer"
                >
                    <MovieCard
                    title={movie.title}
                    poster_path={getImageUrl(movie.poster_path)}
                    vote_average={movie.vote_average}
                    />
                </div>
                ))}
            </div>
        </div>
    );
}

export default MovieList;