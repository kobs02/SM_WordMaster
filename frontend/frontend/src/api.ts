// src/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:7777/api/words'; // 백엔드 API URL

// 모든 단어 조회
export const getAllWords = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching words:", error);
        return [];
    }
};

// 단어 추가
export const createWord = async (wordData: { spelling: string; mean: string; level: string }) => {
    try {
        const response = await axios.post(API_URL, wordData);
        return response.data;
    } catch (error) {
        console.error("Error creating word:", error);
        return null;
    }
};

// 단어 삭제
export const deleteWord = async (id: number) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting word:", error);
    }
};
