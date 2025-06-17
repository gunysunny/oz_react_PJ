// React import(함수형 컴포넌트 사용)
import React from "react";

// MovieCard 컴포넌트: 영화 한 개의 정보를 카드 형태로 출력
// props: title(제목), poster_path(포스터 이미지 URL), vote_average(평균 평점)
function MovieCard({ title, poster_path, vote_average }) {
    return (
        // 카드 전체 컨테이너(흰 배경, 그림자, 라운드, 패딩, 카드 폭, 세로 정렬, 호버 효과, 포인터)
        <div className="bg-white shadow rounded-lg p-4 w-60 flex flex-col items-start hover:scale-105 transition cursor-pointer">
            {/* 영화 포스터 이미지 */}
            <img
                src={poster_path}                           // 이미지 URL(props로 전달)
                alt={title}                                 // 이미지 대체 텍스트(접근성)
                className="w-full h-80 object-cover rounded mb-3"
                // w-full: 부모div 기준 가로 100%, h-80: 고정 높이, object-cover: 비율 유지, rounded: 모서리 라운드, mb-3: 아래 마진
            />
            {/* 영화 제목 */}
            <h3 className="text-lg font-semibold mb-1 text-center">{title}</h3>
            {/* 영화 평점 */}
            <span className="text-gray-500 font-semibold text-sm">
                평점: {vote_average}
            </span>
        </div>
    );
}

export default MovieCard;