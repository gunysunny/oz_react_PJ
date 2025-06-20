import React, { useState } from "react";
import NavBar from "../navbar/NavBar";
import { Outlet } from "react-router-dom";

// 모든 페이지에서 NavBar + 각 페이지 콘텐츠를 동시에 보여주는 Layout 컴포넌트
function Layout() {
    const [search, setSearch] = useState(""); // 검색 상태 Layout에서 관리
    return (
        <div>
            <NavBar onSearch={setSearch} />
            {/* Outlet 자리에 각 Route에 매칭된 컴포넌트가 렌더링됨 */}
            <Outlet context={{ search }} />
        </div>
    );
}

export default Layout;