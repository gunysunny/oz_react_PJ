import React, { useState, useEffect, useRef } from "react";
import { Search, Menu } from "lucide-react";
import useDebounce from "../../hooks/useDebounce"; // 커스텀 훅 import
import { useNavigate } from "react-router-dom";

function NavBar({ onSearch }) {
    const [scrolled, setScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [query, setQuery] = useState("");                // 검색어 입력 상태
    const menuRef = useRef(null);
    const navigate = useNavigate(); // ★★★ 함수 맨 위에 선언!

    // 1. 디바운스된 검색어
    const debouncedQuery = useDebounce(query, 1000); // 600ms 등 자유롭게 조정

    // 2. 디바운스 검색어가 바뀔 때마다 부모로 전달
    useEffect(() => {
        if (onSearch) onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);

    // 3. 스크롤 감지
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // 4. 햄버거 메뉴 외부 클릭 시 닫힘
    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        }
        if (showMenu) {
            document.addEventListener("click", handleClick, true);
        }
        return () => document.removeEventListener("click", handleClick, true);
    }, [showMenu]);

    return (
        <nav
            className={`
                w-full text-white py-4 px-8 shadow fixed z-50 transition-colors duration-500
                ${scrolled ? "bg-gradient-to-r from-[#191654] to-[#318d67] bg-opacity-90 backdrop-blur" : "bg-transparent"}
            `}
            style={{
                boxShadow: scrolled ? "0 4px 20px 0 rgba(0,0,0,0.10)" : "none"
            }}
        >
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                {/* 왼쪽: 로고 */}
                <span className="text-2xl font-bold">MSite</span>

                {/* 가운데: (아무것도 없음) */}

                {/* 오른쪽: 검색버튼 + 햄버거 */}
                <div className="flex items-center gap-3 relative">
                    {/* 검색 버튼 */}
                    <button
                        className="p-2 text-gray-300 hover:text-white transition"
                        onClick={() => setShowSearch(v => !v)}
                    >
                        <Search size={22} />
                    </button>
                    {/* 검색창 (늘어남 & 밑줄만 생김) */}
                    <div
                        className={`
                            overflow-hidden transition-all duration-500
                            border-b-2
                            ${showSearch
                                ? "w-48 border-red-400"
                                : "w-0 border-transparent"
                            }
                        `}
                    >
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="검색어 입력"
                            className={`
                                bg-transparent px-2 py-1 w-full
                                text-white text-sm
                                focus:outline-none
                                transition-all duration-500
                                ${showSearch ? "opacity-100" : "opacity-0"}
                            `}
                            style={{ transition: "opacity 0.5s, width 0.5s" }}
                        />
                    </div>
                    {/* 햄버거 버튼 */}
                    <button
                        className="ml-2 p-2"
                        onClick={() => setShowMenu(!showMenu)}
                        aria-label="메뉴 열기"
                    >
                        <Menu size={28} />
                    </button>
                    {/* 드롭다운 메뉴 */}
                    {showMenu && (
                        <div
                            ref={menuRef}
                            className="absolute right-0 top-12 bg-gray-800 bg-opacity-95 rounded shadow-lg py-2 w-36 flex flex-col animate-fade-in z-50"
                        >
                            <button
                            className="py-2 px-4 hover:bg-gray-700 text-left text-white"
                            onClick={() => navigate("/login")}
                            >
                            로그인
                            </button>
                            <button
                            className="py-2 px-4 hover:bg-gray-700 text-left text-white"
                            onClick={() => navigate("/signup")}
                            >
                            회원가입
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;