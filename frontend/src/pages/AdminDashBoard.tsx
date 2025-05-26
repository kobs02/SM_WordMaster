// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react'
import api from '@/lib/api'
import '@/pages/AdminDashBoard.css'

interface Word {
    id: number
    spelling: string
    mean: string
    level: string
}

const AdminDashboard: React.FC = () => {
    const [words, setWords] = useState<Word[]>([])
    const [newWord, setNewWord] = useState<Omit<Word, 'id'>>({
        spelling: '',
        mean: '',
        level: 'A1',
    })
    const [editWord, setEditWord] = useState<Word | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const wordsPerPage = 20

    // 1) 초기 단어 목록 불러오기
    useEffect(() => {
        console.log('calling:', import.meta.env.VITE_API_BASE_URL + '/words')
        api
            .get<Word[]>('/words')
            .then(res => {
                console.log('loaded words:', res.data)
                setWords(res.data)
            })
            .catch(err => console.error('단어 목록 불러오기 실패:', err))
    }, [])

    // 2) 입력 값 변경 핸들러 (추가/수정 공용)
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        if (editWord) {
            setEditWord({ ...editWord, [name]: value })
        } else {
            setNewWord(prev => ({ ...prev, [name]: value }))
        }
    }

    // 3) 단어 추가
    const handleAddWord = (e: React.FormEvent) => {
        e.preventDefault()
        if (words.some(w => w.spelling === newWord.spelling)) {
            alert('⚠️ 이미 존재하는 단어입니다.')
            return
        }
        api
            .post<Word>('/words', newWord)
            .then(res => {
                setWords(prev => [...prev, res.data])
                setNewWord({ spelling: '', mean: '', level: 'A1' })
            })
            .catch(err => {
                console.error('단어 추가 실패:', err)
                alert('단어 추가 중 오류가 발생했습니다.')
            })
    }

    // 4) 단어 수정 모드 진입
    const handleEdit = (word: Word) => {
        setEditWord({ ...word })
    }

    // 5) 단어 수정 완료
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editWord) return
        api
            .put<Word>(`/words/${editWord.id}`, editWord)
            .then(res => {
                setWords(prev =>
                    prev.map(w => (w.id === res.data.id ? res.data : w))
                )
                setEditWord(null)
            })
            .catch(err => {
                console.error('단어 수정 실패:', err)
                alert('단어 수정 중 오류가 발생했습니다.')
            })
    }

    // 6) 단어 삭제
    const handleDelete = (id: number) => {
        if (!window.confirm('정말로 이 단어를 삭제하시겠습니까?')) return
        api
            .delete(`/words/${id}`)
            .then(() => {
                setWords(prev => prev.filter(w => w.id !== id))
            })
            .catch(err => {
                console.error('단어 삭제 실패:', err)
                alert('단어 삭제 중 오류가 발생했습니다.')
            })
    }

    // 7) 페이지네이션 계산
    const totalPages = Math.ceil(words.length / wordsPerPage)
    const indexOfLast = currentPage * wordsPerPage
    const indexOfFirst = indexOfLast - wordsPerPage
    const currentWords = Array.isArray(words)
        ? words.slice(indexOfFirst, indexOfLast)
        : []

    const goToPage = (n: number) => {
        if (n >= 1 && n <= totalPages) setCurrentPage(n)
    }

    const getPageNumbers = (): (number | string)[] => {
        const delta = 2
        const pages: (number | string)[] = []
        const start = Math.max(1, currentPage - delta)
        const end = Math.min(totalPages, currentPage + delta)

        if (start > 1) {
            pages.push(1)
            if (start > 2) pages.push('...')
        }
        for (let i = start; i <= end; i++) pages.push(i)
        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...')
            pages.push(totalPages)
        }
        return pages
    }

    return (
        <div className="container">
            <h1 className="title">📘 단어장 관리 (Admin)</h1>

            {/* 단어 리스트 */}
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
                {currentWords.map(word => (
                    <tr key={word.id}>
                        <td>{word.id}</td>
                        <td>{word.spelling}</td>
                        <td>{word.mean}</td>
                        <td>{word.level}</td>
                        <td>
                            <button onClick={() => handleEdit(word)}>수정</button>
                        </td>
                        <td>
                            <button onClick={() => handleDelete(word.id)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="pagination">
                <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
                    ⏮ 맨 처음
                </button>
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ◀ 이전
                </button>
                {getPageNumbers().map((p, i) =>
                        typeof p === 'number' ? (
                            <button
                                key={i}
                                className={p === currentPage ? 'active' : ''}
                                onClick={() => goToPage(p)}
                            >
                                {p}
                            </button>
                        ) : (
                            <span key={i} className="dots">
              {p}
            </span>
                        )
                )}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    다음 ▶
                </button>
                <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    맨 끝 ⏭
                </button>
            </div>

            {/* 단어 추가 폼 */}
            <h2 className="subtitle">➕ 단어 추가</h2>
            <form onSubmit={handleAddWord} className="form">
                <input
                    name="spelling"
                    placeholder="단어"
                    value={newWord.spelling}
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="mean"
                    placeholder="뜻"
                    value={newWord.mean}
                    onChange={handleInputChange}
                    required
                />
                <select
                    name="level"
                    value={newWord.level}
                    onChange={handleInputChange}
                >
                    {['A1','A2','B1','B2','C1','C2'].map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
                <button type="submit">추가</button>
            </form>

            {/* 단어 수정 폼 */}
            {editWord && (
                <>
                    <h2 className="subtitle">✏️ 단어 수정</h2>
                    <form onSubmit={handleUpdate} className="form">
                        <input
                            name="spelling"
                            value={editWord.spelling}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            name="mean"
                            value={editWord.mean}
                            onChange={handleInputChange}
                            required
                        />
                        <select
                            name="level"
                            value={editWord.level}
                            onChange={handleInputChange}
                        >
                            {['A1','A2','B1','B2','C1','C2'].map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                        <button type="submit">수정 완료</button>
                    </form>
                </>
            )}
        </div>
    )
}

export default AdminDashboard
