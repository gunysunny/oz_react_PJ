import React from "react";
import NavBar from "../navbar/NavBar";
import { Outlet } from "react-router-dom";

// 모든 페이지에서 NavBar + 각 페이지 콘텐츠를 동시에 보여주는 Layout 컴포넌트
function Layout() {
    return (
        <div>
            <NavBar />
            {/* Outlet 자리에 각 Route에 매칭된 컴포넌트가 렌더링됨 */}
            <Outlet />
        </div>
    );
}

export default Layout;