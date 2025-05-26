import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold">Welcome to SMU WordMaster</h1>
            <div className="mt-4">
                <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    )
}