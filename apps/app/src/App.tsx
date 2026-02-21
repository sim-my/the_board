import { useState } from 'react'
import './index.css'
import EmptyView from './pages/EmptyView'
import Wrapper from './Wrapper';
import Booklet from './pages/Booklet';
import CreateEventModal from './components/CreateEventModal';
import PosterDetailView from './pages/PosterDetailView';

function App() {
  const [isPostEventOpen, setIsPostEventOpen] = useState(false);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(true);


  return (
    <Wrapper onPostEvent={() => setIsPostEventOpen(true)}>
      <Booklet />
      {/* <EmptyView /> */}
      <CreateEventModal open={isPostEventOpen} onClose={() => setIsPostEventOpen(false)}/>    
      <PosterDetailView open={isEventDetailOpen} onClose={() => setIsEventDetailOpen(false)} />
    </Wrapper>
  );
}

export default App
