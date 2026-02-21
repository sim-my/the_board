import { useState } from 'react'
import './App.css'

import Wrapper from './Wrapper'
import Board from './components/Board/Board'
import Booklet from './components/booklet/Booklet'

function App() {
  // which view is active: "board" or "booklet"
  const [view, setView] = useState<"board" | "booklet">("board")

  const handlePostEvent = () => {
    // TODO: Implement post event functionality
    console.log('Post event clicked')
  }

  return (
    <Wrapper 
      onPostEvent={handlePostEvent}
      view={view}
      setView={setView}
    >
      {/* Switch between Board and Booklet depending on toggle */}
      {view === "board" && <Board />}
      {view === "booklet" && <Booklet />}
    </Wrapper>
  )
}

export default App
