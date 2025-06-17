// react에서 useEffect(생명주기), useState(상태관리) import
import { useEffect, useState } from "react";
// useParams: URL 경로의 파라미터(id 등) 추출, useNavigate: 라우터에서 경로 이동을 위한 훅
import { useParams, useNavigate } from "react-router-dom";

// MovieDetail 컴포넌트: 영화 상세 페이지 역할
function MovieDetail() {
    // useParams 훅을 사용하여 경로의 :id 파라미터 값 추출 (현재 상세 페이지의 영화 id)
    const { id } = useParams();
    // movie: 상세 정보 데이터, setMovie: 상태 변경 함수
    const [movie, setMovie] = useState(null);
    // navigate: 뒤로가기 등 경로 이동을 위한 함수
    const navigate = useNavigate();

    // 컴포넌트 마운트 시 한 번 실행: 상세 데이터 fetch
    useEffect(() => {
        fetch("/movieDetailData.json")           // public 폴더 내 더미 상세 데이터 요청
            .then((res) => res.json())           // 응답을 JSON으로 파싱
            .then((data) => setMovie(data));     // 파싱된 데이터로 movie 상태 업데이트
    }, []);

    // movie 데이터가 아직 없으면 로딩 메시지 출력
    if (!movie) return <div className="text-center py-10">Loading...</div>;

    // 배경 이미지 URL 생성: backdrop_path 우선, 없으면 포스터 이미지 사용
    // 삼항 연산자 사용 ?참일경우 값 :참이 아닐경우 값값
    const bgImgUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    return (
        // 전체 상세 페이지 레이아웃(배경, 텍스트 흰색)
        <div className="relative min-h-screen bg-gray-900 text-white">
            {/* 배경 이미지(희미하게 처리) */}
            <div
                className="absolute inset-0 z-0 opacity-40"
                style={{
                    backgroundImage: `url(${bgImgUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            {/* 검은색 오버레이(가독성 강화용) */}
            <div className="absolute inset-0 bg-black opacity-60 z-0" />

            {/* 실제 컨텐츠(상대적 z-index 10, 포스터+상세정보 flex 정렬) */}
            <div className="relative z-10 max-w-4xl mx-auto py-16 flex flex-col md:flex-row items-center gap-8">
                {/* 영화 포스터 이미지 */}
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-64 h-96 object-cover rounded-lg shadow-lg border-4 border-white/40"
                />
                {/* 텍스트 상세 정보 영역 */}
                <div className="flex-1">
                    {/* 영화 제목 */}
                    <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
                    {/* 평점 및 장르 정보(수평 정렬) */}
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-yellow-400 text-xl font-bold">
                            ⭐ {movie.vote_average}
                        </span>
                        <span className="bg-white/10 rounded px-3 py-1 text-sm font-medium">
                            {/* 장르 이름을 / 로 구분하여 나열 */}
                            {movie.genres.map((g) => g.name).join(" / ")}
                        </span>
                    </div>
                    {/* 줄거리(overview) */}
                    <p className="text-lg mb-6">{movie.overview}</p>
                    {/* 뒤로가기 버튼 */}
                    <button
                        className="mt-6 px-5 py-2 rounded bg-gray-800 hover:bg-gray-700"
                        onClick={() => navigate(-1)}   // 브라우저 히스토리에서 이전 페이지로 이동
                    >
                        ← 뒤로가기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MovieDetail;