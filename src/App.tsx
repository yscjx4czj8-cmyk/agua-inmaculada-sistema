import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  return (
    <BrowserRouter>
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
