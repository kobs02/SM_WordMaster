// src/pages/UserDashboard.tsx
import React from 'react'

export default function Dashboard() {
    const defaultLevel = 'A1'

    const menuItems = [
        {
            title: '단어 학습',
            description: 'CEFR 레벨별 단어 학습',
            icon: '📘',
            mode: 'learn',
            bgColor: '#DBEAFE',        // light blue
            iconColor: '#1D4ED8',      // blue-700
        },
        {
            title: '단어 게임',
            description: '학습한 단어로 게임하기',
            icon: '🎮',
            mode: 'game',
            bgColor: '#D1FAE5',        // light green
            iconColor: '#047857',      // green-700
        },
        {
            title: '일일 게임',
            description: '오늘의 단어 도전',
            icon: '📅',
            path: '/daily-game',
            bgColor: '#EDE9FE',        // light purple
            iconColor: '#5B21B6',      // purple-700
        },
        {
            title: '오답 노트',
            description: '틀린 단어 복습하기',
            icon: '⚠️',
            path: '/wrong-answers',
            bgColor: '#FEE2E2',        // light red
            iconColor: '#B91C1C',      // red-700
        },
    ]

    const handleClick = (item: any) => {
        if (item.mode) {
            window.location.href = `/units/${defaultLevel}?mode=${item.mode}`
        } else if (item.path) {
            window.location.href = item.path
        }
    }

    const containerStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16,
        padding: 16,
    }

    const cardStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid #ccc',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }

    const headerStyle = (bg: string): React.CSSProperties => ({
        backgroundColor: bg,
        padding: 16,
    })

    const titleStyle: React.CSSProperties = {
        margin: 0,
        fontSize: 18,
        fontWeight: 600,
    }

    const descStyle: React.CSSProperties = {
        margin: '8px 0 0',
        fontSize: 14,
        color: '#555',
    }

    const footerStyle: React.CSSProperties = {
        padding: 16,
        backgroundColor: '#fff',
    }

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '8px 0',
        border: '1px solid #888',
        borderRadius: 4,
        background: 'white',
        cursor: 'pointer',
        fontSize: 14,
    }

    return (
        <div style={containerStyle}>
            {menuItems.map(item => (
                <div key={item.title} style={cardStyle}>
                    <div style={headerStyle(item.bgColor)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={titleStyle}>{item.title}</h3>
                            <span style={{ fontSize: 24, color: item.iconColor }}>{item.icon}</span>
                        </div>
                        <p style={descStyle}>{item.description}</p>
                    </div>
                    <div style={footerStyle}>
                        <button style={buttonStyle} onClick={() => handleClick(item)}>
                            이동하기
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
