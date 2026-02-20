import Navbar from './components/Navbar'
import Board from './components/Board/Board'
import './App.css'

function App() {
  const handlePostEvent = () => {
    // TODO: Implement post event functionality
    console.log('Post event clicked')
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar onPostEvent={handlePostEvent} />
      <div className="flex-1 overflow-hidden">
        <Board />
      </div>
    </div>
  )
}

export default App
