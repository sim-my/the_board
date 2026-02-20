import { useState } from 'react'
import './index.css'
import EmptyView from './pages/EmptyView'
import Wrapper from './Wrapper';

function App() {
  const [isPostEventOpen, setIsPostEventOpen] = useState(false);

  return (
    <Wrapper onPostEvent={() => setIsPostEventOpen(true)}>
      <EmptyView />
    </Wrapper>
  );
}

export default App
