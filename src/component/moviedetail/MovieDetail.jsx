import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/movieDetailData.json")
        .then((res) => res.json())
        .then((data) => setMovie(data));
    }, []);

    if (!movie) return <div className="text-center py-10">Loading...</div>;

    const bgImgUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    return (
        <div className="relative min-h-screen bg-gray-900 text-white">
            {/* 배경 이미지 */}
            <div
                className="absolute inset-0 z-0 opacity-40"
                style={{
                backgroundImage: `url(${bgImgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                }}
            />
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black opacity-60 z-0" />

            {/* 내용 */}
            <div className="relative z-10 max-w-4xl mx-auto py-16 flex flex-col md:flex-row items-center gap-8">
                {/* 포스터 */}
                <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-64 h-96 object-cover rounded-lg shadow-lg border-4 border-white/40"
                />
                {/* 상세 정보 */}
                <div className="flex-1">
                    <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-yellow-400 text-xl font-bold">
                        ⭐ {movie.vote_average}
                        </span>
                        <span className="bg-white/10 rounded px-3 py-1 text-sm font-medium">
                        {movie.genres.map((g) => g.name).join(" / ")}
                        </span>
                    </div>
                    <p className="text-lg mb-6">{movie.overview}</p>
                    <button
                        className="mt-6 px-5 py-2 rounded bg-gray-800 hover:bg-gray-700"
                        onClick={() => navigate(-1)}
                    >
                        ← 뒤로가기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MovieDetail;