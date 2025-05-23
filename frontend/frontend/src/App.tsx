import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"; // 👈 아래에 정의된 CSS 불러오기

interface Word {
    id: number;
    spelling: string;
    mean: string;
    level: string;
}

const App: React.FC = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [newWord, setNewWord] = useState<Word>({ id: 0, spelling: '', mean: '', level: 'A1' });
    const [editWord, setEditWord] = useState<Word | null>(null);

    useEffect(() => {
        axios.get('http://localhost:7777/api/words')
            .then((response) => {
                setWords(response.data);
            })
            .catch((error) => {
                console.error('단어 목록 불러오기 실패:', error);
            });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewWord({ ...newWord, [name]: value });
    };

    // 단어 추가 요청 처리
    const handleAddWord = (e: React.FormEvent) => {
        e.preventDefault();
        const isDuplicate = words.some(word => word.spelling === newWord.spelling);
        if (isDuplicate) {
            alert("⚠️ 이미 존재하는 단어입니다.");
            return;
        }
        // newWord에서 id를 제외한 객체만 생성
        const { spelling, mean, level } = newWord;

        axios.post('http://localhost:7777/api/words', { spelling, mean, level })
            .then((response) => {
                setWords([...words, response.data]); // 목록에 추가
                setNewWord({ id: 0, spelling: '', mean: '', level: 'A1' }); // 입력값 초기화
            })
            .catch((error) => {
                console.error('단어 추가 실패:', error);
                alert('단어 추가 중 오류가 발생했습니다.');
            });
    };

    // 단어 삭제 요청 처리
    const handleDelete = (id: number) => {
        if (!id || id === 0) {
            alert("잘못된 ID입니다. 삭제할 수 없습니다.");
            return;
        }

        const confirmDelete = window.confirm("정말로 이 단어를 삭제하시겠습니까?");
        if (!confirmDelete) return;

        axios.delete(`http://localhost:7777/api/words/${id}`)
            .then(() => {
                setWords(words.filter(word => word.id !== id));
            })
            .catch((error) => {
                console.error('단어 삭제 실패:', error);
                alert("단어 삭제 중 오류가 발생했습니다.\n존재하지 않는 항목일 수도 있습니다.");
            });
    };


    // 단어 수정 불러오기 처리
    const handleEdit = (word: Word) => {
        if (!word || !word.id) {
            alert("수정할 단어 정보를 불러올 수 없습니다.");
            return;
        }
        // 깊은 복사로 상태 오염 방지 (불변성 유지)
        const wordCopy: Word = { ...word };
        setEditWord(wordCopy);
    };


    //단어 수정 요청 처리
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editWord) {
            axios.put(`http://localhost:7777/api/words/${editWord.id}`, editWord)
                .then((response) => {
                    setWords(words.map(word => word.id === editWord.id ? response.data : word));
                    setEditWord(null);
                })
                .catch((error) => {
                    console.error('단어 수정 실패:', error);
                });
        }
    };


    //페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const wordsPerPage = 20;

// 현재 페이지의 단어들만 추출
    const indexOfLastWord = currentPage * wordsPerPage;
    const indexOfFirstWord = indexOfLastWord - wordsPerPage;
    const currentWords = words.slice(indexOfFirstWord, indexOfLastWord);

// 총 페이지 수
    const totalPages = Math.ceil(words.length / wordsPerPage);

// 페이지 이동 핸들러
    const goToPage = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const getPageNumbers = () => {
        const delta = 2; // 현재 페이지 기준 앞뒤 2개
        const pages = [];

        const startPage = Math.max(1, currentPage - delta);
        const endPage = Math.min(totalPages, currentPage + delta);

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };


    return (
        <div className="container">
            <h1 className="title">📘 단어장 목록</h1>

            <table className="word-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>단어</th>
                    <th>뜻</th>
                    <th>레벨</th>
                    <th>수정</th>
                    <th>삭제</th>
                </tr>
                </thead>
                <tbody>
                {currentWords.map((word) => (
                    <tr key={word.id}>
                        <td>{word.id}</td>
                        <td>{word.spelling}</td>
                        <td>{word.mean}</td>
                        <td>{word.level}</td>
                        <td>
                            <button className="edit-btn" onClick={() => handleEdit(word)}>수정</button>
                        </td>
                        <td>
                            <button className="delete-btn" onClick={() => handleDelete(word.id)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>

            </table>
            <div className="pagination">
                <button onClick={goToFirstPage} disabled={currentPage === 1}>⏮ 맨 처음</button>
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>◀ 이전</button>

                {/* 숫자 페이지 버튼들 */}
                {getPageNumbers().map((page, index) => (
                    typeof page === "number" ? (
                        <button
                            key={index}
                            className={`page-number ${currentPage === page ? "active" : ""}`}
                            onClick={() => goToPage(page)}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="dots">...</span>
                    )
                ))}

                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>다음 ▶</button>
                <button onClick={goToLastPage} disabled={currentPage === totalPages}>맨 끝 ⏭</button>
            </div>




            <h2 className="subtitle">➕ 단어 추가</h2>
            <form onSubmit={handleAddWord} className="form">
                <label>
                    단어:
                    <input type="text" name="spelling" value={newWord.spelling} onChange={handleInputChange} required />
                </label>
                <label>
                    뜻:
                    <input type="text" name="mean" value={newWord.mean} onChange={handleInputChange} required />
                </label>
                <label>
                    레벨:
                    <select name="level" value={newWord.level} onChange={handleInputChange}>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                    </select>
                </label>
                <button type="submit" className="add-btn">추가</button>
            </form>

            {editWord && (
                <>
                    <h2 className="subtitle">✏️ 단어 수정</h2>
                    <form onSubmit={handleUpdate} className="form">
                        <label>
                            단어:
                            <input type="text" name="spelling" value={editWord.spelling} onChange={(e) => setEditWord({ ...editWord, spelling: e.target.value })} required />
                        </label>
                        <label>
                            뜻:
                            <input type="text" name="mean" value={editWord.mean} onChange={(e) => setEditWord({ ...editWord, mean: e.target.value })} required />
                        </label>
                        <label>
                            레벨:
                            <select name="level" value={editWord.level} onChange={(e) => setEditWord({ ...editWord, level: e.target.value })}>
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="B1">B1</option>
                                <option value="B2">B2</option>
                                <option value="C1">C1</option>
                                <option value="C2">C2</option>
                            </select>
                        </label>
                        <button type="submit" className="edit-btn">수정 완료</button>
                    </form>
                </>
            )}
        </div>
    );
};
export default App;