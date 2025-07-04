import React, { useState, useEffect, useRef } from "react";
import { Search, Menu, User } from "lucide-react";
import useDebounce from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

function NavBar({ onSearch }) {
    // 상태값
    const [scrolled, setScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [query, setQuery] = useState("");
    const menuRef = useRef(null);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();

    // user 상태 (context)
    const { user, setUser } = useUserContext();

    // 검색어 디바운스
    const debouncedQuery = useDebounce(query, 1000);

    // 검색어가 바뀔 때마다 onSearch 실행
    useEffect(() => {
        if (onSearch) onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);

    // 스크롤 시 상단바 배경 변화
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // 메뉴/유저 드롭다운 바깥 클릭시 닫기
    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        }
        if (showMenu || showUserMenu) {
            document.addEventListener("click", handleClick, true);
        }
        return () => document.removeEventListener("click", handleClick, true);
    }, [showMenu, showUserMenu]);

    // 로그아웃 함수
    const handleLogout = () => {
        setUser(null); // 전역 user 상태를 null로(로그아웃 처리)
        setShowUserMenu(false);
        navigate("/"); // 홈으로 이동(필요없으면 생략)
    };

    return (
        <nav
            className={`
                w-full text-white py-4 px-10 shadow fixed z-50 transition-colors duration-500
                ${scrolled ? "bg-gradient-to-r from-[#191654] to-[#318d67] bg-opacity-90 backdrop-blur" : "bg-transparent"}
            `}
            style={{
                boxShadow: scrolled ? "0 4px 20px 0 rgba(0,0,0,0.10)" : "none"
            }}
        >
            <div className="max-w-full mx-auto flex items-center justify-between">
                {/* 왼쪽: 로고 */}
                <span className="text-2xl font-bold">MSite</span>
                {/* 오른쪽 */}
                <div className="flex items-center gap-3 relative">
                    {/* 항상 렌더, width/opacity로 애니메이션 */}
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="검색어 입력"
                        className={`
                            bg-transparent px-2 py-1
                            text-white text-sm focus:outline-none border-b-2 border-red-600
                            transition-all duration-500
                            mr-2
                            ${showSearch ? "w-48 opacity-100" : "w-0 opacity-0 pointer-events-none"}
                        `}
                        style={{
                            transition: "width 0.5s, opacity 0.5s, margin-right 0.5s",
                            minWidth: 0,
                            overflow: "hidden"
                        }}
                        autoFocus={showSearch}
                    />

                    {/* 검색버튼은 항상 오른쪽 */}
                    <button
                        className="px-2 text-gray-300 hover:text-white transition"
                        onClick={() => setShowSearch(v => !v)}
                        tabIndex={0}
                        aria-label="검색"
                    >
                        <Search size={22} />
                    </button>
                    {/* 검색창 */}
                    

                    {/* 로그인 전: 로그인/회원가입 메뉴 */}
                    {!user && (
                        <>
                            <button
                                className="ml-2 p-2"
                                onClick={() => setShowMenu(!showMenu)}
                                aria-label="메뉴 열기"
                            >
                                <Menu size={28} />
                            </button>
                            {showMenu && (
                                <div
                                    ref={menuRef}
                                    className="absolute right-0 top-12 bg-gray-800 bg-opacity-95 rounded shadow-lg py-2 w-36 flex flex-col animate-fade-in z-50"
                                >
                                    <button
                                        className="py-2 px-4 hover:bg-gray-700 text-left text-white"
                                        onClick={() => {
                                            navigate("/login");
                                            setShowMenu(false);
                                        }}
                                    >
                                        로그인
                                    </button>
                                    <button
                                        className="py-2 px-4 hover:bg-gray-700 text-left text-white"
                                        onClick={() => {
                                            navigate("/signup");
                                            setShowMenu(false);
                                        }}
                                    >
                                        회원가입
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* 로그인 후: 사람(유저) 아이콘 */}
                    {user && (
                        <>
                            <button
                                className="ml-2 px-2"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                aria-label="유저 메뉴 열기"
                            >
                                <User size={28} />
                            </button>
                            {showUserMenu && (
                                <div
                                    ref={userMenuRef}
                                    className="absolute right-0 top-12 bg-gray-800 bg-opacity-95 rounded shadow-lg py-2 w-36 flex flex-col animate-fade-in z-50"
                                >
                                    <button
                                        className="py-2 px-4 hover:bg-gray-700 text-left text-white"
                                        onClick={() => {
                                            navigate("/mypage");
                                            setShowUserMenu(false);
                                        }}
                                    >
                                        마이페이지
                                    </button>
                                    <button
                                        className="py-2 px-4 hover:bg-gray-700 text-left text-white"
                                        onClick={handleLogout}
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;