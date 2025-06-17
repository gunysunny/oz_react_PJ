// React에서 useState(상태관리), useEffect(생명주기 함수) import
import React, { useState, useEffect } from "react";
// MovieCard: 영화 카드 1개를 렌더링하는 프레젠테이셔널 컴포넌트 import
import MovieCard from "../moviecard/MovieCard";
// useNavigate: 라우터의 경로 이동을 위한 훅(import from react-router-dom)
import { useNavigate } from "react-router-dom";

// MovieList 컴포넌트: 영화 목록 페이지 역할
function MovieList() {
    // movieList: 영화 데이터 배열 상태, setMovieList: 상태 변경 함수
    const [movieList, setMovieList] = useState([]);
    // navigate: 라우터에서 경로 이동을 위한 함수
    const navigate = useNavigate();

    // 컴포넌트 마운트 시 한 번만 실행(빈 deps) → 영화 데이터 fetch
    useEffect(() => {
        fetch("/movieListData.json")                    // public 폴더의 더미 데이터 요청
            .then(res => res.json())                    // 응답을 JSON으로 파싱
            .then(data => setMovieList(data.results))   // data.results 배열을 상태로 저장
            .catch(err => console.error("데이터 불러오기 실패", err)); // 에러 발생 시 콘솔에 출력
    }, []);
    // 마지막에 빈 배열을 넣으므로, 처음 렌더링 딱 한 번만 실행 (아무것도 안넣을 시 무한루프 위험)

    // TMDB 영화 포스터 이미지 URL 생성 유틸 함수 
    // 삼항 연산자 사용 
    // posterPath 값이 **존재(참)**하면 → 실제 영화 포스터 이미지를 반환
    // posterPath 값이 없으면(거짓) → 기본 이미지(플레이스홀더 이미지)를 반환
    const getImageUrl = (posterPath) =>
        posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`   // TMDB 포스터 경로 있으면 해당 이미지 사용
            : "https://placehold.co/300x450?text=No+Image";    // 없으면 플레이스홀더 이미지 사용

    return (
        // 페이지 전체 레이아웃(최소 높이, 배경, 상하 여백)
        <div className="min-h-screen bg-gray-100 py-10">
            {/* 페이지 타이틀 */}
            <h1 className="text-3xl font-bold text-center mb-8">🎬 인기 영화 모음</h1>
            {/* 영화 카드 리스트(flex-wrap: 줄바꿈, gap-6: 카드 사이 간격) */}
            <div className="flex flex-wrap justify-center gap-6 w-full max-w-none min-w-0">
                {/* 영화 목록 배열을 map으로 반복하여 각 MovieCard 렌더링 */}
                {movieList.map((movie) => (
                    // 각 카드 클릭 시 해당 영화 id로 상세페이지로 이동
                    <div key={movie.id} onClick={() => navigate(`/detail/${movie.id}`)} // 상세페이지로 이동
                        className="cursor-pointer"
                    >
                        {/* MovieCard 컴포넌트에 영화 정보(제목/포스터/평점) 전달 */}
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