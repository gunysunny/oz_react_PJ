// React 함수형 컴포넌트 및 훅 임포트
import React, { useState, useEffect, useRef } from "react";
// MovieCard: 영화 카드 컴포넌트 임포트
import MovieCard from "../moviecard/MovieCard";
// useNavigate: 페이지 이동용 훅 임포트 (react-router-dom)
import { useNavigate } from "react-router-dom";

// 카드 하나의 가로폭(px)
const CARD_WIDTH = 260;
// 카드 사이 여백(px)
const CARD_MARGIN = 6;

// 각 카드의 원통상 각도 계산 (전체를 360도로 나눔)
function degForIndex(idx, total) {
  return (360 / total) * idx;
}

// 원통형 영화 캐러셀(3D) 컴포넌트
function MovieCylinder({ movies }) {
    // 현재 보여줄 카드 인덱스 (회전 기준점)
    const [index, setIndex] = useState(0);
    // 상세페이지 이동용 라우터 훅
    const navigate = useNavigate();
    // 보여줄 카드 전체(배열), 총 카드 개수
    const visible = movies;
    const total = visible.length;
    // 원통의 반지름(px) (카드가 많을수록 자동으로 넓힘)
    const radius = Math.max(600, total * 10);

    // 최상위 컨테이너에 접근할 ref (휠 이벤트용)
    const containerRef = useRef();


    // ✅ 자동 회전: 3초마다 index 1 증가(→ 오른쪽 한 칸씩 이동)
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % total);
        }, 3000);
        return () => clearInterval(timer); // 언마운트 시 타이머 해제
    }, [total]);

    
    // ✅ 마우스 휠로 회전 제어 (휠 내리면 index+1, 올리면 index-1)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        // 휠 이벤트 핸들러
        const onWheel = (e) => {
            e.preventDefault(); // 화면 기본 스크롤 방지
            if (e.deltaY > 0) setIndex((prev) => (prev + 1) % total);       // 아래로: 오른쪽
            else if (e.deltaY < 0) setIndex((prev) => (prev - 1 + total) % total); // 위로: 왼쪽
        };
        container.addEventListener("wheel", onWheel, { passive: false });
        return () => container.removeEventListener("wheel", onWheel);
    }, [total]);


        const mainBg =
            visible[index]?.backdrop_path
                ? `https://image.tmdb.org/t/p/original${visible[index].backdrop_path}`
            : visible[index]?.poster_path
                ? `https://image.tmdb.org/t/p/w780${visible[index].poster_path}`
            : "https://placehold.co/1000x600?text=No+Image";

    return (
        // 원통 전체 컨테이너(가로/세로 중앙정렬, 원근감, overflow:hidden)
        <div
            className="flex items-center justify-center w-full pb-[150px]"
            ref={containerRef}
            // style={{
            //     height: 825,
            //     perspective: 1600,
            //     overflow: "hidden",
            // }}
            style={{
                height: 825,
                perspective: 1600,
                overflow: "hidden",
                backgroundImage: `linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.88)), url(${mainBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                transition: "background-image 0.7s cubic-bezier(.4,0,.2,1)",
            }}
        >
            {/* 원통 트랙(카드 실제 회전 트랙) */}
            <div
                className="relative"
                style={{
                    width: CARD_WIDTH + CARD_MARGIN,
                    height: 380,
                    // transformStyle: "preserve-3d",                 // 3D 효과
                    // transform: `rotateY(${-(360 / total) * index}deg)`, // index 변화에 따라 회전
                    transform: `skewY(-10deg) translateX(${-index * (CARD_WIDTH + CARD_MARGIN)}px)`,
                    transition: "transform 0.7s cubic-bezier(.4,0,.2,1)", // 부드럽게 회전
                }}
            >
                {/* 각 영화 카드를 원통 표면에 나란히 배치 */}
                {visible.map((movie, i) => {
                // 정면 카드(index), 바로 옆(좌우), 그 외
                let opacity = 0.2; // 기본(멀리 있는 카드)
                let filter = "blur(2.5px)";
                let zIdx = 1;
                let transform = "";
                    if (i === index) {
                        // 메인카드: 살짝 기울임, 대폭 확대!
                        opacity = 1;
                        filter = "none";
                        zIdx = 10;
                        transform = "skewY(-4deg) scale(1.48) rotateZ(-2deg)";
                    } else if (
                        i === (index - 1 + total) % total ||
                        i === (index + 1) % total
                    ) {
                        // 바로 옆 카드: 약간만 크고, 적당히 기울임
                        opacity = 0.65;
                        filter = "none";
                        zIdx = 5;
                        transform = "skewY(-10deg) scale(0.85) rotateZ(-10deg)";
                    } else {
                        // 그 외: 많이 기울고, 축소
                        transform = "skewY(-16deg) scale(0.7) rotateZ(-16deg)";
                    }


            // 포커스 카드만 skew와 scale을 풀어주기
            const cardTransform = i === index
                ? "skewY(0deg) scale(1.15) rotateZ(0deg)"     // 포커스 카드 (정면, 확대, 평면)
                : "skewY(-10deg) scale(1) rotateZ(-10deg)";   // 나머지 카드 (기울고, 작고, 누워있음)


            return (
                <div
                    key={movie.id + "-skew-" + i}
                            style={{
                            position: "absolute",
                            top: "27%", // 필요에 따라 조절
                            left: i * (CARD_WIDTH + CARD_MARGIN),
                            width: CARD_WIDTH,
                            transition: "opacity 0.5s, filter 0.5s, transform 0.7s cubic-bezier(.4,0,.2,1)",
                            cursor: "pointer",
                            opacity,
                            filter,
                            zIndex: zIdx,
                            transform,
                            // ⭐️ 카드 기울기, 중심 강조
                            // transform: i === index
                                // ? "scale(1.08) rotateZ(-5deg)"
                            //     : "rotateZ(-10deg)",
                            }}
                // 캐러셀 원통
                    // key={movie.id + "-cylinder-" + i}
                    // style={{
                    //     position: "absolute",
                    //     left: 0,
                    //     top: "50%",
                    //     width: CARD_WIDTH,
                    //     transform: `
                    //         rotateY(${degForIndex(i, total)}deg)
                    //         translateZ(${radius}px)
                    //         translateY(-50%)
                    //     `,
                    //     transition: "transform 0.7s cubic-bezier(.4,0,.2,1), opacity 0.5s, filter 0.5s",
                    //     cursor: "pointer",
                    //     opacity,
                    //     filter,
                    //     zIndex: i === index ? 2 : 1, // 정면 카드가 위로 보이게
                    // }}

                    onClick={() => navigate(`/detail/${movie.id}`)}
                >
                    <MovieCard
                        title={movie.title}
                        poster_path={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : "https://placehold.co/300x450?text=No+Image"
                        }
                        vote_average={movie.vote_average}
                    />
                </div>
            );
        })}
            </div>
        </div>
    );
}

export default MovieCylinder;