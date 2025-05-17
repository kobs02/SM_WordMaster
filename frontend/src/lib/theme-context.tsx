import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    // 로컬 스토리지에서 테마 설정 불러오기
    const storedTheme = localStorage.getItem("theme") as Theme | null
    if (storedTheme && storedTheme !== "system") {
      setTheme(storedTheme)
    } else {
      // 시스템 테마를 로컬 스토리지에 저장하지 않도록 변경
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme)
    }
  }, [])

  useEffect(() => {
    // 테마 변경 시 로컬 스토리지에 저장 (system 제외)
    if (theme !== "system") {
      localStorage.setItem("theme", theme)
    }

    // 테마 적용
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
