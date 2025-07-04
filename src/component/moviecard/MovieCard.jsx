import React from "react";
import { Heart } from "lucide-react"; // lucide-react의 하트 아이콘


function MovieCard({
    id,
    title,
    poster_path,
    vote_average,
    isWished, // 이 영화가 위시리스트에 등록되어 있는지 여부
    onToggleWish, // 하트 클릭 핸들러(영화 id 전달)
    }) {
    return (
        <div className="bg-black/60 backdrop-blur-md shadow-lg rounded-xl p-4 w-60 flex flex-col items-start hover:scale-105 hover:shadow-2xl transition cursor-pointer border border-gray-700">
            <img
                src={poster_path}
                alt={title}
                className="w-full h-80 object-cover rounded-lg mb-3 shadow-md hover:shadow-lg transition"
            />
            <h3 className="text-base font-bold mb-1 text-white text-center w-full truncate">{title}</h3>
            {/* 평점/하트 영역 */}
            <div className="flex items-center justify-between w-full mt-1">
                <span className="text-yellow-400 font-semibold text-sm flex items-center">
                {/* 왼쪽에 별 */}
                ⭐ {vote_average}
                </span>
                <button
                className="ml-auto p-1"
                onClick={e => {
                    e.stopPropagation(); // 카드 클릭 방지
                    onToggleWish(id);
                }}
                aria-label={isWished ? "찜 해제" : "찜 추가"}
                >
                <Heart
                    size={22}
                    fill={isWished ? "#f87171" : "none"} // 채우기: 찜상태면 빨간색
                    color={isWished ? "#f87171" : "#aaa"} // 테두리
                />
                </button>
            </div>
        </div>
    );
}

export default MovieCard;