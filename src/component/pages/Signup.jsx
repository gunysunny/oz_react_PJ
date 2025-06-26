import React, { useState, useEffect } from "react";
import InputField from "../InputField";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth/useAuth";
import useDebounce from "../../hooks/useDebounce";

const validate = {
    name: v => !/^[a-zA-Z0-9가-힣]{2,8}$/.test(v) ? "이름은 2~8자, 숫자/한글/영어만 사용!" : "",
    email: v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "이메일 형식이 아닙니다." : "",
    password: v => !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(v) ? "비밀번호는 영어+숫자 6자 이상!" : "",
    passwordCheck: (v, pwd) => v !== pwd ? "비밀번호가 일치하지 않습니다." : "",
};
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

function Signup() {
    const [fields, setFields] = useState({ name: "", email: "", password: "", passwordCheck: "" });
    const [errors, setErrors] = useState({});
    const [bgUrl, setBgUrl] = useState("");
    const debouncedName = useDebounce(fields.name, 500);
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();
    const { signUp } = useAuth(); // ⭐️ Supabase 회원가입 함수 가져오기

    useEffect(() => {
        if (fields.name === debouncedName) {
        setErrors(e => ({ ...e, name: validate.name(debouncedName) }));
        }
    }, [debouncedName]);

    // 영화 백드롭 배경
    useEffect(() => {
        fetch("https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1", {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_TOKEN}`,
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

    // 입력 핸들러
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

    // 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(""); // 서버에러 초기화

        const newErrors = {
            name: validate.name(fields.name),
            email: validate.email(fields.email),
            password: validate.password(fields.password),
            passwordCheck: validate.passwordCheck(fields.passwordCheck, fields.password),
        };
        setErrors(newErrors);

        // 프론트 유효성 통과시에만 회원가입
        if (Object.values(newErrors).every(v => !v)) {
            try {
                const { error } = await signUp({
                    email: fields.email,
                    password: fields.password,
                    userName: fields.name, // Supabase User Table 확장 컬럼 (옵션)
                });
                if (error) {
                    // 이미 가입, 기타 에러 등
                    setServerError(error.message || "회원가입 실패. 잠시 후 다시 시도해주세요.");
                } else {
                    alert("회원가입 성공! 로그인 후 이용해주세요.");
                    navigate("/login");
                }
            } catch (err) {
                setServerError(err.message || "알 수 없는 서버 에러");
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
            {/* 왼쪽 폼 */}
            <div className="w-full md:w-[620px] z-10 flex flex-col items-center justify-center min-h-screen bg-black/30 backdrop-blur-md">
                <div className="max-w-xs w-full p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-white text-center">회원가입</h2>
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <InputField
                            label="이름"
                            name="name"
                            placeholder="2~8자 한글, 영어, 숫자"
                            value={fields.name}
                            onChange={handleChange}
                            error={errors.name}
                        />
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
                        <InputField
                            label="비밀번호 확인"
                            name="passwordCheck"
                            type="password"
                            placeholder="비밀번호 재입력"
                            value={fields.passwordCheck}
                            onChange={handleChange}
                            error={errors.passwordCheck}
                        />
                        {/* 서버에러 출력 */}
                        {serverError && <div className="text-red-400 text-sm mb-2">{serverError}</div>}
                        <button
                            type="submit"
                            className="
                                w-full 
                                bg-gradient-to-r from-purple-700 via-pink-600 to-blue-600 
                                hover:from-purple-900 hover:via-pink-700 hover:to-blue-800 
                                text-white font-bold py-2 mt-4 rounded shadow-lg transition-all
                            "
                        >
                            회원가입
                        </button>
                    </form>
                    <button
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 mt-3 rounded"
                        onClick={() => navigate("/login")}
                    >
                        로그인으로 이동
                    </button>
                </div>
            </div>
            {/* 오른쪽: 랜덤 영화 배경 */}
        </div>
    );
}

export default Signup;