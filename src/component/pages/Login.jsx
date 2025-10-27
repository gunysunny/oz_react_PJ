import React, { useState, useEffect } from "react";
import InputField from "../inputfield.jsx";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "../../../supabase/auth/index.js";
import { useUserContext } from "../../context/UserContext";


const validate = {
    email: v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "이메일 형식이 아닙니다." : "",
    password: v => !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(v) ? "비밀번호는 영어+숫자 6자 이상!" : "",
};
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

function Login() {
    const [fields, setFields] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [bgUrl, setBgUrl] = useState("");
    const [submitError, setSubmitError] = useState(""); // 서버 에러 표시
    const navigate = useNavigate();

    // ⭐ Supabase 로그인 함수 가져오기
    const { login } = useSupabaseAuth();
    const { setUser } = useUserContext();
    const { loginWithGoogle, loginWithKakao } = useSupabaseAuth();

    const handleGoogleLogin = async () => {
        await loginWithGoogle();
    };

    const handleKakaoLogin = async () => {
        await loginWithKakao();
    };

    // 배경 영화 백드롭 불러오기
    useEffect(() => {
        fetch("https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1", {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_TOKEN}`
            }
        })
        .then(res => res.json())
        .then(data => {
            const candidates = data.results.filter(movie => movie.backdrop_path);
            if (candidates.length > 0) {
                const rand = Math.floor(Math.random() * candidates.length);
                setBgUrl("https://image.tmdb.org/t/p/original" + candidates[rand].backdrop_path);
            }
        });
    }, []);

    const handleChange = e => {
    // 방어코드 추가
        const { name, value } = e.target || {};
        if (!name) {
            console.error('handleChange: name 속성이 없는 이벤트입니다.', e.target);
            return;
        }
        setFields(f => ({ ...f, [name]: value }));
        setErrors(e => ({ ...e, [name]: '' }));
        setSubmitError('');
    };

    // ⭐⭐⭐ 실제 로그인!
    const handleSubmit = async e => {
        e.preventDefault();
        const newErrors = {
            email: validate.email(fields.email),
            password: validate.password(fields.password),
        };
        setErrors(newErrors);

        if (Object.values(newErrors).every(v => !v)) {
            // 실제 supabase 로그인 요청
            try {
                const result = await login({ email: fields.email, password: fields.password });
                if (result?.error) {
                    setSubmitError(result.error.message || "로그인 실패!");
                } else if (result.user) {
                    setUser(result.user);   // ← 이 줄 추가!
                    navigate("/");  // 로그인 성공시 메인으로 이동
                }
            } catch (err) {
                setSubmitError("서버 연결 오류!");
            }
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-start relative"
            style={{
                background: bgUrl
                    ? `linear-gradient(to right, rgba(16,14,33,0.94) 35%, rgba(10,10,15,0.1) 80%, rgba(0,0,0,0.82) 100%), url(${bgUrl}) right center/cover no-repeat`
                    : "#111"
            }}
        >
            <div className="w-full md:w-[620px] z-10 flex flex-col items-center justify-center min-h-screen bg-black/30 backdrop-blur-md">
                <div className="max-w-xs w-full p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">로그인</h2>
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <InputField
                            label="이메일"
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            value={fields.email}
                            onChange={handleChange}
                            error={errors.email}
                        />
                        <InputField
                            label="비밀번호"
                            name="password"
                            type="password"
                            placeholder="영어+숫자 6자 이상"
                            value={fields.password}
                            onChange={handleChange}
                            error={errors.password}
                        />
                        {submitError && (
                            <div className="text-red-500 text-sm mt-2 mb-[-10px] text-center">{submitError}</div>
                        )}
                        <button
                            type="submit"
                            className="
                                w-full
                                bg-gradient-to-r from-purple-700 via-pink-600 to-blue-600
                                hover:from-purple-900 hover:via-pink-700 hover:to-blue-800
                                text-white font-bold py-2 mt-4 rounded shadow-lg transition-all
                            "
                        >
                            로그인
                        </button>
                    </form>
                    <button
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 mt-3 rounded"
                        onClick={() => navigate("/signup")}
                    >
                        회원가입으로 이동
                    </button>

                    <div className="mt-4 flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full bg-white text-black font-bold py-2 rounded shadow"
                        >
                            Google로 로그인
                        </button>
                        <button
                            type="button"
                            onClick={handleKakaoLogin}
                            className="w-full bg-yellow-400 text-black font-bold py-2 rounded shadow"
                        >
                            Kakao로 로그인
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;