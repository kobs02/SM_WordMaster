import { useNavigate } from "react-router-dom";
import { BookOpen, GamepadIcon as GameController, Calendar, AlertTriangle } from "lucide-react";

export default function UserPage() {
  const navigate = useNavigate();
  const defaultLevel = "A1"; // 추후 user.level 등으로 동적 설정 가능

  const menuItems = [
    {
      title: "단어 학습",
      description: "CEFR 레벨별 단어 학습",
      icon: BookOpen,
      mode: "learn",
      color: "blue",
      iconColor: "blue",
    },
    {
      title: "단어 게임",
      description: "학습한 단어로 게임하기",
      icon: GameController,
      mode: "game",
      color: "green",
      iconColor: "green",
    },
    {
      title: "일일 게임",
      description: "오늘의 단어 도전",
      icon: Calendar,
      path: "/daily-game",
      color: "purple",
      iconColor: "purple",
    },
    {
      title: "오답 노트",
      description: "틀린 단어 복습하기",
      icon: AlertTriangle,
      path: "/wrong-answers",
      color: "red",
      iconColor: "red",
    },
  ];

  const handleClick = (item: any) => {
    if (item.mode === "learn" || item.mode === "game") {
      // ✅ query string으로 mode 전달
      navigate(`/units/${defaultLevel}?mode=${item.mode}`);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
      <div className="dashboard">
        <div className="card-container">
          {menuItems.map((item) => (
              <div key={item.title} className={`card ${item.color}`}>
                <div className="card-header">
                  <h2 className="card-title">{item.title}</h2>
                  <item.icon className={`icon ${item.iconColor}`} />
                </div>
                <p className="card-description">{item.description}</p>
                <button className="card-button" onClick={() => handleClick(item)}>
                  이동하기
                </button>
              </div>
          ))}
        </div>
      </div>
  );
}
