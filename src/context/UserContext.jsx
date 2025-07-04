import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    // ⭐ App 시작 시 localStorage에서 userInfo 복구
    useEffect(() => {
        const saved = localStorage.getItem("userInfo");
        if (saved) {
        setUser(JSON.parse(saved));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
        {children}
        </UserContext.Provider>
    );
    }

export function useUserContext() {
    return useContext(UserContext);
}