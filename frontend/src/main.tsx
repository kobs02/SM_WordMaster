import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './Home'
import Help from "./app/help/page"
import LevelSelect from "./app/level-select/page"
import LevelTest from "./app/level-test/page"
import Game from "./app/game/page"
import Memorize from "./app/memorize/page"
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/help" element={<Help />} />
        <Route path="/level-select" element={<LevelSelect />} />
        <Route path="/level-test" element={<LevelTest />} />
        <Route path="/game" element={<Game />} />
        <Route path="/memorize" element={<Memorize />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)