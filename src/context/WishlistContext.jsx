import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  // ⭐ localStorage 연동
    const [wishlist, setWishlist] = useState(() => {
        const stored = localStorage.getItem("wishlist");
        return stored ? JSON.parse(stored) : [];
    });

    // localStorage 반영 (상태 바뀔 때마다)
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    // 추가/삭제 (id 기준)
    const toggleWish = (movie) => {
        setWishlist(prev =>
        prev.some(item => item.id === movie.id)
            ? prev.filter(item => item.id !== movie.id)
            : [...prev, movie]
        );
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWish }}>
        {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
