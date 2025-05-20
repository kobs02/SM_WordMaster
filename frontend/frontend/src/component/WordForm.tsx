// src/components/WordForm.tsx
import React, { useState } from 'react';
import { createWord } from '../api';

const WordForm = () => {
    const [spelling, setWord] = useState('');
    const [mean, setMean] = useState('');
    const [level, setLevel] = useState('A1');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newWord = { spelling, mean, level };
        const result = await createWord(newWord);
        if (result) {
            setWord('');
            setMean('');
            setLevel('A1');
            alert('단어가 추가되었습니다!');
        }
    };

    return (
        <div>
            <h2>단어 추가</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={spelling}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="단어"
                    required
                />
                <input
                    type="text"
                    value={mean}
                    onChange={(e) => setMean(e.target.value)}
                    placeholder="뜻"
                    required
                />
                <select value={level} onChange={(e) => setLevel(e.target.value)} required>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                </select>
                <button type="submit">추가</button>
            </form>
        </div>
    );
};

export default WordForm;
