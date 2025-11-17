import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLenisScroll from './hooks/useLenisScroll';
import Homepage from './pages/Homepage';
import Planets from './pages/Planets';
import Starfield from './components/Starfield';
import InitialLoader from './pages/InitialLoader';
import { SoundProvider } from './context/SoundProvider';

function App() {
  // useLenisScroll();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenInit = sessionStorage.getItem("initialSeen") === "true";

    if (!hasSeenInit && location.pathname === "/") {
      navigate("/init", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <SoundProvider>
          <Starfield />
          <Routes>
            <Route path='/init' element={<InitialLoader />} />
            <Route path='/' element={<Homepage />} />
            <Route path='/planets' element={<Planets />} />
          </Routes>
      </SoundProvider>
    </>
  );
}

export default App;
