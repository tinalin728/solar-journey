import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useLenisScroll from './hooks/useLenisScroll';
import Homepage from './pages/Homepage';
import Planets from './pages/Planets';
import Starfield from './components/Starfield';
import { SoundProvider } from './components/SoundProvider';

function App() {
  // useLenisScroll();

  return (
    <>
      <SoundProvider>
        <Router>
          <Starfield />
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/planets' element={<Planets />} />
          </Routes>
        </Router>
      </SoundProvider>
    </>
  );
}

export default App;
