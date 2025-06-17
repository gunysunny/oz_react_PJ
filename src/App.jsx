// react-router-dom에서 라우터 관련 컴포넌트(import)
// BrowserRouter: 전체 앱에 라우팅 기능을 적용(히스토리, 주소 관리)
// Routes: 여러 Route를 그룹화하는 컴포넌트
// Route: 특정 경로(path)에 특정 컴포넌트(element)를 렌더링
import { BrowserRouter, Routes, Route } from "react-router-dom";
// 영화 목록 페이지 컴포넌트 import
import MovieList from "./component/movielist/MovieList";
// 영화 상세 페이지 컴포넌트 import
import MovieDetail from "./component/moviedetail/MovieDetail";
import Layout from "./component/layout/Layout";

// App 컴포넌트: 전체 애플리케이션의 라우팅 구조를 담당
function App() {
  return (
    // BrowserRouter로 전체 앱을 감싸서 라우팅 기능 활성화(히스토리, URL 동기화 등)
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Layout이 렌더링되고, 그 안에서 Outlet에 아래 컴포넌트가 들어감 */}
          <Route index element={<MovieList />} />
          <Route path="detail/:id" element={<MovieDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// App 컴포넌트 export(기본 내보내기)
export default App;
