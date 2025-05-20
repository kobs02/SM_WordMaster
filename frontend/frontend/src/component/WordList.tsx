// src/components/WordList.tsx
import React, { useEffect, useState } from 'react';
import axios from "axios";

type Word = {
    id: number;
    spelling: string;
    mean: string;
    level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
};

const WordList: React.FC = () => {
    const [words, setWords] = useState<Word[]>([]);

    // 컴포넌트가 마운트될 때 단어 목록을 불러옵니다.
    useEffect(() => {
        axios
            .get<Word[]>("http://localhost:7777/api/words")
            .then((res) => setWords(res.data))
            .catch((err) => console.error("단어 가져오기 실패", err));
    }, []);

    return (
        <div>
            <h2>📘 단어 목록</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>단어</th>
                    <th>뜻</th>
                    <th>레벨</th>
                </tr>
                </thead>
                <tbody>
                {words.map((word) => (
                    <tr key={word.id}>
                        <td>{word.id}</td>
                        <td>{word.spelling}</td>
                        <td>{word.mean}</td>
                        <td>{word.level}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default WordList;