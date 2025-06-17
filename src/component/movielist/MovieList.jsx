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
        // public 폴더의 movieListData.json 더미 데이터 요청
        fetch("/movieListData.json")
            .then((res) => res.json())           // 응답을 JSON으로 변환
            .then((data) => setMovieList(data.results)); // 결과 배열만 상태로 저장
    }, []);

    return (
        // 전체 페이지 레이아웃(최소 높이/배경/상단 여백)
        <div className="min-h-screen bg-gray-100 py-[90px]">
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