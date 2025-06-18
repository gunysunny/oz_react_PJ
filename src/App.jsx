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
  {/* Routes로 여러 Route(페이지)를 그룹화 - 모든 라우팅은 BrowserRouter 내부에서만 동작 */}
  <Routes>
    {/* path="/"에 진입하면 Layout 컴포넌트가 가장 먼저 렌더링됨 - Layout 안에는 NavBar(상단 고정)와 <Outlet>이 포함됨 - 아래의 자식 Route(index, detail)가 <Outlet> 위치에 표시됨 */}
    <Route path="/" element={<Layout />}>
      {/* index: path="/"와 동일(루트 경로) - 기본적으로 MovieList 컴포넌트가 Layout 내부 <Outlet>에 렌더링됨 */}
      <Route index element={<MovieList />} />

      {/* path="detail/:id" : /detail/123 같은 상세 페이지 - :id는 동적 파라미터(영화 고유 id) - MovieDetail 컴포넌트가 Layout의 <Outlet>에 렌더링됨 */}
      <Route path="detail/:id" element={<MovieDetail />} />
    </Route>
  </Routes>
</BrowserRouter>
  );
}

// App 컴포넌트 export(기본 내보내기)
export default App;
