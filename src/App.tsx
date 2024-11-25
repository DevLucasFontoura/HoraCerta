import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import GlobalStyles from './styles/GlobalStyles';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Home';
import TimeRecord from './pages/TimeRecord';
import Analytics from './pages/Analytics/index';
import Settings from './pages/Settings/index';

function App() {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas protegidas dentro do Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/time-record" element={<TimeRecord />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Redireciona rotas não encontradas para o dashboard */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;