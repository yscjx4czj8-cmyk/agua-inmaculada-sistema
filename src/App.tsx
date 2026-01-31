import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calidad from './pages/Calidad';
import Mantenimientos from './pages/Mantenimientos';
import Agenda from './pages/Agenda';
import Finanzas from './pages/Finanzas';
import Manual from './pages/Manual';
import Reportes from './pages/Reportes';
import VisitaSemanal from './pages/VisitaSemanal';

function App() {
  const fetchInitialData = useStore((state) => state.fetchInitialData);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calidad" element={<Calidad />} />
          <Route path="mantenimientos" element={<Mantenimientos />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="finanzas" element={<Finanzas />} />
          <Route path="manual" element={<Manual />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="visita" element={<VisitaSemanal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
