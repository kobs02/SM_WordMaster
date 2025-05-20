import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="h-9 w-9 relative"
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${theme === "dark" ? "rotate-0 scale-0" : "rotate-0 scale-100"}`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
      />
      <span className="sr-only">{theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}</span>
    </Button>
  );
}
