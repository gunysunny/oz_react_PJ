import React, { useState, useEffect, useRef } from "react";
// 검색어 입력시, 일정 시간(여기선 1초) 동안 입력이 없으면 API 호출하는 커스텀 훅
import useDebounce from "../../hooks/useDebounce";
// 부모 컴포넌트에서 context 값(여기선 search: 검색어) 받아오는 react-router-dom 훅
import { useOutletContext } from "react-router-dom";
import MovieCylinder from "../slider/MovieCylinder"; // 원통형 영화 캐러셀
import MovieGrid from "../moviegrid/MovieGrid";      // 영화 그리드 리스트

function MovieList() {
    // 부모 outlet에서 검색어 받아오기
    const { search } = useOutletContext();

    // 입력한 검색어에 디바운스(지연) 적용 - 입력 끝난 뒤 1초 후에만 반영됨
    const debouncedSearch = useDebounce(search, 1000);

    // 그리드 영화 목록
    const [movieList, setMovieList] = useState([]);

    // 현재 페이지 (무한스크롤용)
    const [page, setPage] = useState(1);

    // 로딩 중 여부 (로딩 표시용)
    const [loading, setLoading] = useState(false);

    // 더 불러올 수 있는지 (무한스크롤 종료 제어)
    const [hasMore, setHasMore] = useState(true);

    // 원통 캐러셀에 쓸 영화 데이터 (보통 1페이지만)
    const [cylinderMovies, setCylinderMovies] = useState([]);

    // IntersectionObserver용 감시 타겟 ref
    const loader = useRef(null);

    // TMDB API 토큰 (.env에서 가져옴)
    const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

    const [wishlist, setWishlist] = useState([]);

    // --- [1] 검색 or 인기영화 1페이지 로딩 ---
    useEffect(() => {
        // 검색어가 있으면 -> 검색 API 호출
        if (debouncedSearch) {
            setLoading(true); // 로딩 상태 시작
            fetch(
                `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(debouncedSearch)}&language=ko-KR&page=1`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${API_TOKEN}`
                    }
                }
            )
                .then(res => res.json())
                .then(data => {
                    // 결과가 있으면 성인영화 제외, 없으면 빈 배열
                    const filtered = data.results?.filter(movie => movie.adult === false) ?? [];
                    setCylinderMovies(filtered); // 캐러셀에 할당
                    setMovieList(filtered);      // 그리드에 할당
                    setHasMore(false);           // 검색 결과는 무한스크롤 OFF
                    setPage(1);                  // 1페이지로 초기화
                })
                .finally(() => setLoading(false)); // 로딩 종료
            return;
        }
        
        // 검색어 없으면 -> 인기영화 1페이지 호출
        setLoading(true);
        fetch(
            `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`,
            {
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${API_TOKEN}`
                }
            }
        )
            .then(res => res.json())
            .then(data => {
                const filtered = data.results?.filter(movie => movie.adult === false) ?? [];
                setCylinderMovies(filtered); // 캐러셀에 할당
                setMovieList(filtered);      // 그리드에 할당
                setHasMore(true);            // 무한스크롤 ON
                setPage(1);                  // 1페이지로 초기화
            })
            .finally(() => setLoading(false));
    }, [debouncedSearch, API_TOKEN]);

    // --- [2] 인기영화 추가 페이지 로딩 (무한스크롤) ---
    useEffect(() => {
        // 검색 모드거나(검색 중이거나) 첫 페이지(이미 불러옴)이면 실행하지 않음
        if (debouncedSearch || page === 1) return;
        setLoading(true);
        fetch(
            `https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`,
            {
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${API_TOKEN}`
                }
            }
        )
            .then(res => res.json())
            .then(data => {
                // 성인영화 제외, 결과 없으면 빈 배열
                const filtered = data.results?.filter(movie => movie.adult === false) ?? [];
                // 기존 영화 리스트 뒤에 붙이기
                setMovieList(prev => [...prev, ...filtered]);
                // 결과 없거나 마지막 페이지면 무한스크롤 OFF
                if (!data.results.length || page >= data.total_pages) setHasMore(false);
            })
            .finally(() => setLoading(false));
    }, [page, debouncedSearch, API_TOKEN]);

    // --- [3] 무한스크롤 IntersectionObserver ---
    useEffect(() => {
        // 더 불러올 게 없으면 실행 안 함
        if (!hasMore) return;
        // IntersectionObserver 생성
        const observer = new window.IntersectionObserver(
            (entries) => {
                // loader div가 화면에 보이고 로딩 중이 아닐 때 -> 다음 페이지로 이동
                if (entries[0].isIntersecting && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 } // 100% 보일 때만 트리거
        );
        // loader div에 observer 등록
        if (loader.current) observer.observe(loader.current);
        // 클린업 (컴포넌트 언마운트시, 의존성 변경시)
        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, [loader, hasMore, loading]);

    // --- [4] 입력/로딩 안내 메시지 ---
    let statusMessage = null;
    // 아직 디바운스 안 끝남(입력 중)
    if (search && search !== debouncedSearch) {
        statusMessage = <div className="text-center my-5">검색어 입력 중...</div>;
    } else if (loading) {
        // fetch 진행중
        statusMessage = <div className="text-center my-5">검색 중...</div>;
    }

    const handleToggleWish = (movieId) => {
        setWishlist(prev =>
            prev.includes(movieId)
            ? prev.filter(id => id !== movieId) // 이미 있으면 제거
            : [...prev, movieId]                // 없으면 추가
        );
    };

    // --- [5] 렌더링 영역 ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-[#232f3e] text-white">
             {/* 검색어가 없을 때만 캐러셀 보이기 */}
            {!debouncedSearch && (
            <MovieCylinder movies={cylinderMovies} />
            )}
            {/* 그리드 영화 리스트는 항상 */}
                <MovieGrid
                    movies={movieList}
                    wishlist={wishlist}
                    onToggleWish={handleToggleWish}
                />
                {statusMessage}
            <div ref={loader} />
        </div>
    );
}

export default MovieList;