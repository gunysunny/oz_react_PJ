import React, { useState } from "react";
import { Heart, User, ChevronRight, BookOpen, Star, Home } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useNavigate } from "react-router-dom"; // 추가

const menuList = [
    { name: "회원정보", icon: <User size={18} /> },
    { name: "나의 리뷰", icon: <BookOpen size={18} /> },
    { name: "위시리스트", icon: <Heart size={18} className="text-red-400" /> },
    { name: "고객센터", icon: <Star size={18} /> },
];

function MyPage() {
    const { wishlist, toggleWish } = useWishlist();
    const [currentMenu, setCurrentMenu] = useState("위시리스트"); // 메뉴 선택 상태
    const navigate = useNavigate(); // ⭐️ 추가

  // 각 메뉴별 컨텐츠 컴포넌트
    const renderContent = () => {
        switch (currentMenu) {
        case "위시리스트":
            return (
            <div>
                <div className="flex items-center gap-3 mb-5">
                    <Heart size={36} fill="#ef4444" className="text-red-400" />
                    <h2 className="text-3xl font-extrabold text-white tracking-wide drop-shadow">WISHLIST</h2>
                </div>
                <hr className="border-[#444565] mb-8" />
                <div className="flex gap-10 flex-wrap justify-center min-h-[400px]">
                    {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full text-gray-300 text-xl py-20">
                        <Heart size={52} className="mb-3 text-gray-500/60 animate-pulse" />
                        <span>아직 찜한 영화가 없습니다.</span>
                        <span className="text-sm mt-2 text-gray-400">영화 목록에서 하트를 눌러 위시리스트에 추가해보세요!</span>
                    </div>
                ) : (
                    wishlist.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => navigate(`/detail/${item.id}`)}
                        className="bg-gradient-to-br from-[#232946] via-[#1f2233] to-[#232325] rounded-2xl p-3 w-[210px] flex flex-col items-center shadow-lg hover:shadow-pink-700/40 hover:scale-105 transition-all duration-300 relative border border-[#363858]/40 cursor-pointer"
                    >
                        <img
                            src={item.poster}
                            alt={item.title}
                            className="w-full h-64 object-cover rounded-xl mb-3 shadow-xl hover:ring-2 hover:ring-pink-900/80 transition"
                        />
                        <button
                            className="absolute top-4 right-5 z-10 hover:scale-125 transition"
                            
                            onClick={e => {
                            e.stopPropagation();   // ⭐️ 이벤트 버블링 중단!!
                            toggleWish(item);
                        }}
                            aria-label="찜 해제"
                        >
                            <Heart size={27} className="text-pink-200 drop-shadow" fill="#ff3b3b" />
                        </button>
                        <div className="text-base font-bold text-white mb-1 text-center w-full truncate">
                            {item.title}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-300 text-sm font-semibold">
                            <span>★</span>
                            <span>{item.rating}</span>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </div>
            );
        case "회원정보":
            return (
            <div className="text-gray-200">
                    <h2 className="text-2xl font-bold mb-5">회원정보</h2>
                <div className="bg-gray-900/80 p-6 rounded-xl max-w-xl">
                    <div>이름: <span className="font-semibold">test11</span></div>
                    <div>이메일: <span className="font-semibold">test11@email.com</span></div>
                    {/* 필요하면 추가 */}
                </div>
            </div>
            );
        case "나의 리뷰":
            return (
            <div className="text-gray-200">
                <h2 className="text-2xl font-bold mb-5">나의 리뷰</h2>
                <div className="bg-gray-900/80 p-6 rounded-xl max-w-xl">
                <span>작성한 리뷰가 없습니다.</span>
                </div>
            </div>
            );
        case "고객센터":
            return (
            <div className="text-gray-200">
                <h2 className="text-2xl font-bold mb-5">고객센터</h2>
                <div className="bg-gray-900/80 p-6 rounded-xl max-w-xl">
                <span>문의 사항이 있으신가요? 1:1 문의를 남겨주세요.</span>
                </div>
            </div>
            );
        default:
            return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#22223b] via-[#1a1a2e] to-[#232f3e]">
        {/* 사이드바 */}
        <aside className="w-[260px] bg-[#181818] flex flex-col items-center py-4 px-4 border-r border-[#31346b]/30 min-h-screen">
            {/* 홈 아이콘 버튼 */}
            <button
                className="
                            mb-8
                            flex items-center justify-center
                            w-20 h-14
                            text-white text-2xl font-extrabold
                            tracking-widest
                            shadow-lg
                            drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)]
                            [text-shadow:0_0_12px_rgba(255,255,255,0.9),0_0_12px_#a5b4fc,0_2px_1px_rgba(0,0,0,0.16)]
                            bg-transparent
                            rounded-2xl
                            select-none
                            cursor-pointer
                        "
                onClick={() => navigate("/")}
                aria-label="홈으로 이동"
            >
                MSite
            </button>
            {/* 프로필 이미지 */}
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-3 overflow-hidden">
            <img
                src="https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295396_1280.png"
                alt="profile"
                className="w-24 h-24 rounded-full object-cover"
            />
            </div>
            {/* 닉네임 */}
            <div className="text-lg font-bold text-white mb-8">test11 님</div>
            {/* 메뉴 */}
            <nav className="w-full flex flex-col gap-2">
            {menuList.map((item) => (
                <button
                key={item.name}
                className={`
                    w-full flex items-center justify-between py-3 px-5 rounded-lg transition-all font-semibold
                    ${item.name === currentMenu
                    ? "bg-gradient-to-r from-pink-600 via-purple-700 to-blue-700 text-white shadow"
                    : "hover:bg-gray-700/80 text-gray-200"
                    }`}
                onClick={() => setCurrentMenu(item.name)}
                >
                <span className="flex items-center gap-2">
                    {item.icon}
                    {item.name}
                </span>
                <ChevronRight size={18} />
                </button>
            ))}
            </nav>
        </aside>
        {/* 메인 영역 */}
        <main className="flex-1 flex justify-center items-center py-12">
            <div className="w-full max-w-[90%] bg-[#181a24]/80 rounded-2xl p-10 min-h-[70vh] shadow-2xl backdrop-blur-xl border border-[#31346b]/30">
            {renderContent()}
            </div>
        </main>
        </div>
    );
}

export default MyPage;