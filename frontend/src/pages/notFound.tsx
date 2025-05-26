import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div style={{ textAlign: "center", marginTop: "10%" }}>
            <h1>404 - 페이지를 찾을 수 없습니다 😥</h1>
            <p>요청하신 페이지가 존재하지 않거나, 이동되었을 수 있어요.</p>
            <Link to="/" style={{ color: "#007bff", textDecoration: "underline" }}>
                홈으로 돌아가기
            </Link>
        </div>
    );
}