import axios from 'axios';
import { MemberDTO } from '../types/Member';

// 로그인 처리
export const login = async (member: MemberDTO) => {
    const response = await axios.post<MemberDTO>(
        'http://localhost:7777/api/login',
        member,
        { withCredentials: true }
    );
    return response.data;
};

// 회원가입 처리
export const register = async (member: MemberDTO) => {
    const response = await axios.post(
        'http://localhost:7777/api/register',
        member,
        { withCredentials: true }
    );
    return response.data;
};
