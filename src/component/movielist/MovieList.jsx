import React, { useState, useEffect, useRef } from "react";
import MovieCylinder from "../slider/MovieCylinder";
import MovieGrid from "../moviegrid/MovieGrid";

// 영화 리스트(홈페이지) 컴포넌트
function MovieList() {
    // movieList: 무한 스크롤로 표시할 전체 영화 목록(상태)
    const [movieList, setMovieList] = useState([]);
    // page: 현재 불러온 페이지 번호(2페이지 이상 무한스크롤에서 필요)
    const [page, setPage] = useState(1);
    // loading: 데이터 불러오는 중 표시용 플래그
    const [loading, setLoading] = useState(false);
    // hasMore: 더 불러올 영화가 남았는지 여부(마지막 페이지 체크)
    const [hasMore, setHasMore] = useState(true);

    // cylinderMovies: 캐러셀(원통형 슬라이더)에 쓸 첫 페이지(1page) 영화들
    const [cylinderMovies, setCylinderMovies] = useState([]);

    // loader: 페이지 맨 아래에 붙여서, 화면에 보이면 다음 페이지 불러오도록 감지할 DOM 요소(Ref)
    const loader = useRef(null);
    const TMDB_MOVIE_BASE_URL = "https://api.themoviedb.org/3/movie";

    // ⭐ 첫 1페이지 데이터: 캐러셀+그리드용으로 최초 1회만 가져옴
    useEffect(() => {
        const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN; // 환경변수에서 TMDb v4 토큰 읽음
        fetch(`${TMDB_MOVIE_BASE_URL}/popular?language=ko-KR&page=1`, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_TOKEN}` // 인증
            }
        })
            .then(res => res.json()) // 응답 JSON 파싱
            .then(data => {
                // 성인영화 제외
                const filtered = data.results.filter(movie => movie.adult === false);
                setCylinderMovies(filtered); // 캐러셀은 첫 1페이지만 사용
                setMovieList(filtered);      // 그리드도 1페이지로 시작
            });
    }, []); // 컴포넌트 마운트 시 최초 1회만 실행

    // ⭐ 추가 페이지(2, 3, ...) 데이터: 무한스크롤로 추가될 때마다 동작
    useEffect(() => {
        if (page === 1) return; // 첫 페이지는 위에서 이미 가져옴(중복 요청 방지)
        const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
        setLoading(true); // 로딩중 표시 ON
        fetch(`${TMDB_MOVIE_BASE_URL}/popular?language=ko-KR&page=${page}`, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_TOKEN}`
            }
        })
            .then(res => res.json())
            .then(data => {
                // 성인영화 제외
                const filtered = data.results.filter(movie => movie.adult === false);
                setMovieList(prev => [...prev, ...filtered]); // 이전 영화 + 새로 받아온 영화 합치기
                // 마지막 페이지(더 이상 불러올 영화가 없음)면 hasMore를 false로 변경
                if (!data.results.length || page >= data.total_pages) {
                    setHasMore(false);
                }
                setLoading(false); // 로딩중 표시 OFF
            });
    }, [page]); // page 값이 바뀔 때마다 실행(2페이지 이상 요청 시)

    // ⭐ 무한스크롤 기능: 페이지 맨 아래(loader)까지 스크롤되면 page+1
    useEffect(() => {
        if (!hasMore) return; // 더 불러올 영화 없으면 실행 안함
        // IntersectionObserver: loader ref 요소가 화면에 보이면 콜백 실행
        const observer = new window.IntersectionObserver(
            (entries) => {
                // loader가 보이고(=isIntersecting) 로딩중이 아니면 page + 1
                if (entries[0].isIntersecting && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 } // 완전히 보일 때만 동작(1.0)
        );
        if (loader.current) observer.observe(loader.current); // loader 감시 시작
        return () => {
            if (loader.current) observer.unobserve(loader.current); // 컴포넌트 언마운트 시 해제
        };
    }, [loader, hasMore, loading]);

    return (
        // 전체 페이지(최소 높이, 배경 색상, 상단 여백, 흰색 텍스트)
        <div className="min-h-screen py-[90px] bg-gradient-to-br from-gray-900 via-gray-800 to-[#232f3e] text-white">
            {/* 페이지 제목 */}
            <h1 className="text-3xl font-bold text-center mb-16">🎬 인기 영화 모음</h1>
            {/* 원통형 슬라이더(캐러셀)는 1페이지(첫 20개)만 전달 */}
            <MovieCylinder movies={cylinderMovies} />
            {/* 그리드(무한스크롤): 영화 리스트 전체 전달 */}
            <MovieGrid movies={movieList} />
            {/* 로딩중일 때 표시 */}
            {loading && <div className="text-center my-5">로딩중...</div>}
            {/* 페이지 맨 아래 감지용(무한스크롤 트리거용) */}
            <div ref={loader} />
        </div>
    );
}

export default MovieList;