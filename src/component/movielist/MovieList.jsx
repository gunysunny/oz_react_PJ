import React, { useState, useEffect, useRef } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useOutletContext } from "react-router-dom"; // <-- 이 한 줄 꼭!
import MovieCylinder from "../slider/MovieCylinder";
import MovieGrid from "../moviegrid/MovieGrid";

function MovieList() {
    const { search } = useOutletContext();
    const debouncedSearch = useDebounce(search, 1000);
    const [movieList, setMovieList] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [cylinderMovies, setCylinderMovies] = useState([]);
    const loader = useRef(null);
    const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

    // 1️⃣ 검색 or 인기영화 1페이지 (debouncedSearch 의존)
    useEffect(() => {
        // 1) 검색어가 있으면 검색 API fetch
        if (debouncedSearch) {
            setLoading(true);
            fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(debouncedSearch)}&language=ko-KR&page=1`, {
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${API_TOKEN}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    const filtered = data.results?.filter(movie => movie.adult === false) ?? [];
                    setCylinderMovies(filtered); // 캐러셀
                    setMovieList(filtered);      // 그리드
                    setHasMore(false);           // 검색은 무한스크롤 X
                    setPage(1);                  // 검색마다 page 리셋
                })
                .finally(() => setLoading(false));
            return;
        }
        // 2) 검색어 없으면 인기영화 1페이지 fetch
        setLoading(true);
        fetch(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_TOKEN}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const filtered = data.results?.filter(movie => movie.adult === false) ?? [];
                setCylinderMovies(filtered); // 캐러셀
                setMovieList(filtered);      // 그리드
                setHasMore(true);            // 무한스크롤 ON
                setPage(1);                  // 인기영화 첫페이지
            })
            .finally(() => setLoading(false));
    }, [debouncedSearch, API_TOKEN]);

    // 2️⃣ 인기영화 추가 페이지 (무한스크롤, 인기영화 모드일 때만)
    useEffect(() => {
        if (debouncedSearch || page === 1) return; // 검색 중이거나 첫페이지면 X
        setLoading(true);
        fetch(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=${page}`, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_TOKEN}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const filtered = data.results?.filter(movie => movie.adult === false) ?? [];
                setMovieList(prev => [...prev, ...filtered]);
                if (!data.results.length || page >= data.total_pages) setHasMore(false);
            })
            .finally(() => setLoading(false));
    }, [page, debouncedSearch, API_TOKEN]);

    // 3️⃣ 무한스크롤 IntersectionObserver
    useEffect(() => {
        if (!hasMore) return;
        const observer = new window.IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );
        if (loader.current) observer.observe(loader.current);
        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, [loader, hasMore, loading]);

    let statusMessage = null;
    if (search && search !== debouncedSearch) {
        statusMessage = <div className="text-center my-5">검색어 입력 중...</div>;
    } else if (loading) {
        statusMessage = <div className="text-center my-5">검색 중...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-[#232f3e] text-white">
            <MovieCylinder movies={cylinderMovies} />
            <MovieGrid movies={movieList} />
            {statusMessage}
            <div ref={loader} />
        </div>
    );
}

export default MovieList;