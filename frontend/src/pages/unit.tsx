import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Header } from "@/components/layout/header";
import type { CEFRLevel } from "@/lib/types";
const baseURL = import.meta.env.VITE_API_BASE_URL;

type UnitCountData = {
  level: CEFRLevel;
  count: number;
};

export default function UnitPage() {
  const navigate = useNavigate();
  const { level: defaultLevel } = useParams<{ level: string }>();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get("mode") as "learn" | "game") || "learn";

  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>((defaultLevel as CEFRLevel) || "A1");
  const [unitCounts, setUnitCounts] = useState<Record<CEFRLevel, number>>({} as Record<CEFRLevel, number>);
  const [loading, setLoading] = useState(true);

  const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

  useEffect(() => {
    const fetchUnitCounts = async () => {
      try {
        const res = await fetch(`${baseURL}/api/words/countUnits`);
        if (!res.ok) {
          console.error("countUnits 응답 status:", res.status, res.statusText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const list = await res.json() as Array<{ level: string; count: number }>;
        if (!Array.isArray(list)) {
          throw new Error("API 응답 형식이 올바르지 않습니다.");
        }

        const counts = list.reduce<Record<CEFRLevel, number>>((acc, { level, count }) => {
          acc[level as CEFRLevel] = count;
          return acc;
        }, {} as Record<CEFRLevel, number>);

        setUnitCounts(counts);
      } catch (err) {
        console.error("레벨별 유닛 개수 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnitCounts();
  }, []);


  const handleSelect = (unitId: number) => {
    const path = mode === "learn"
      ? `/learn/${selectedLevel}/unit/${unitId}`
      : `/game/${selectedLevel}/unit/${unitId}`;
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {mode === "learn" ? "단어 학습" : "단어 게임"} - 레벨 및 유닛 선택
        </h1>

        {loading ? (
          <div>불러오는 중...</div>
        ) : (
          <Tabs defaultValue={selectedLevel} onValueChange={(v) => setSelectedLevel(v as CEFRLevel)}>
            <TabsList className="grid grid-cols-6 mb-8">
              {levels.map((lvl) => (
                <TabsTrigger key={lvl} value={lvl}>
                  {lvl}
                </TabsTrigger>
              ))}
            </TabsList>

            {levels.map((lvl) => (
              <TabsContent key={lvl} value={lvl} className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">{lvl} 레벨 유닛</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Array.from({ length: unitCounts[lvl] || 0 }, (_, i) => i + 1).map((unitId) => (
                    <Button
                      key={unitId}
                      variant="outline"
                      className="h-20 text-lg"
                      onClick={() => handleSelect(unitId)}
                    >
                      Unit {unitId} {mode === "learn" ? "학습" : "게임"}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
}
