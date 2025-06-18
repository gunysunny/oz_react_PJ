import React from "react";

function NavBar() {
    return (
        <nav className="w-full bg-gray-900 text-white py-4 px-8 shadow fixed z-50">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                {/* 왼쪽: 로고 */}
                <span className="text-2xl font-bold">🎬 MovieSite</span>

                {/* 가운데: 검색 input */}
                <div className="flex-1 flex justify-center px-4">
                    <input
                        type="text"
                        placeholder="영화 제목을 검색하세요"
                        className="w-full max-w-md px-4 py-2 rounded-full bg-gray-300 border-none text-black text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* 오른쪽: 로그인/회원가입 버튼 */}
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white font-semibold">
                        로그인
                    </button>
                    <button className="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white font-semibold">
                        회원가입
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;