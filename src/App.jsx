import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useLenisScroll from './hooks/useLenisScroll';
import Homepage from './pages/Homepage';
import Planets from './pages/Planets';
import Starfield from './components/Starfield';

function App() {
  // useLenisScroll();

  return (
    <>
      <Router>
        <Starfield />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/planets' element={<Planets />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
