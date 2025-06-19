// React 관련 함수(상태관리, 생명주기) 임포트
import React, { useState, useEffect } from "react";
// 원통형 영화 캐러셀(슬라이더) 컴포넌트 임포트
import MovieCylinder from "../slider/MovieCylinder";
// 플렉스 그리드 카드 리스트 컴포넌트 임포트
import MovieGrid from "../moviegrid/MovieGrid";

// 영화 목록(홈페이지) 컴포넌트
function MovieList() {
    // movieList: 영화 배열 상태값, setMovieList: 상태 변경 함수
    const [movieList, setMovieList] = useState([]);

    // 컴포넌트 마운트 시 한 번 실행(빈 배열: 최초 1회만 실행)
        useEffect(() => {
            const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN; // .env에 v4 토큰 저장
            const API_URL = "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1";

            fetch(API_URL, {
            method: "GET",
            headers: {
                accept: "application/json", // 응답 타입 지정
                Authorization: `Bearer ${API_TOKEN}` // .env에 저장한 v4 토큰 사용
            }
            })
                .then(res => res.json())
                .then(data => {
                    // adult: false인 영화만 필터링해서 저장
                    const filtered = data.results.filter(movie => movie.adult === false);
                    setMovieList(filtered);
                })
                .catch(error => {
                    console.error("영화 데이터 가져오기 실패:", error);
                });
        }, []);

    return (
        // 전체 페이지 레이아웃(최소 높이/배경/상단 여백)
        <div className=" min-h-screen py-[90px] bg-gradient-to-br from-gray-900 via-gray-800 to-[#232f3e] text-white">
            {/* 페이지 제목 */}
            <h1 className="text-3xl font-bold text-center mb-16">🎬 인기 영화 모음</h1>
            {/* 1. 원통형 3D 캐러셀(슬라이드) 뷰 */}
            <MovieCylinder movies={movieList} />
            {/* 2. 일반 카드 그리드(플렉스 여러줄) 뷰 */}
            <MovieGrid movies={movieList} />
        </div>
    );
}

export default MovieList;