// src/lib/api.ts
import axios from "axios";

// 백엔드 스프링부트가 7777번 포트에 떠 있으니, baseURL에 맞춰 줍니다.
const API = axios.create({
    baseURL: "http://localhost:7777/api",
    withCredentials: true,                // 세션 쿠키를 함께 보내고 받을 때 필요
});

export default API;
