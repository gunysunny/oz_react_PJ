import React from "react";

function MovieCard({ title, poster_path, vote_average }) {
    return (
        <div className="bg-white shadow rounded-lg p-4 w-60 flex flex-col items-start hover:scale-105 transition cursor-pointer">
        <img
            src={poster_path}
            alt={title}
            className="w-full h-80 object-cover rounded mb-3"
        />
        <h3 className="text-lg font-semibold mb-1 text-center">{title}</h3>
        <span className="text-gray-500 font-semibold text-sm">
            평점: {vote_average}
        </span>
        </div>
    );
}
export default MovieCard;