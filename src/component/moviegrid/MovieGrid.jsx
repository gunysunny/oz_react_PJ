// src/component/moviegrid/MovieGrid.jsx

import React from "react";
import MovieCard from "../moviecard/MovieCard";
import { useNavigate } from "react-router-dom";

// 일반 flex 카드 그리드 영화 리스트
function MovieGrid({ movies }) {
    const navigate = useNavigate();

    return (
        <div>
            {/* 섹션 제목 */}
            <h2 className="text-2xl font-bold mb-4 mt-12 text-center">카드 그리드 보기</h2>
            {/* 카드들을 flex-wrap으로 여러 줄 나열 */}
            <div className="flex flex-wrap justify-center gap-6">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/detail/${movie.id}`)}
                    >
                        <MovieCard
                            title={movie.title}
                            poster_path={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "https://placehold.co/300x450?text=No+Image"
                            }
                            vote_average={movie.vote_average}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieGrid;
