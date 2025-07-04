// src/component/moviegrid/MovieGrid.jsx

import React from "react";
import MovieCard from "../moviecard/MovieCard";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

// 일반 flex 카드 그리드 영화 리스트
function MovieGrid({ movies }) {
    const navigate = useNavigate();
    const { wishlist, toggleWish } = useWishlist(); // ⭐ 전역 위시리스트

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 mt-12 text-center">인기 추천 영화</h2>
            <div className="flex flex-wrap justify-center gap-6">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/detail/${movie.id}`)}
                    >
                        <MovieCard
                            id={movie.id}
                            title={movie.title}
                            poster_path={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "https://placehold.co/300x450?text=No+Image"
                            }
                            vote_average={movie.vote_average}
                            isWished={wishlist.some(item => item.id === movie.id)}
                            onToggleWish={() => toggleWish({
                                id: movie.id,
                                title: movie.title,
                                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                                rating: movie.vote_average,
                            })}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieGrid;
