import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar';
import DashboardPage from './pages/DashboardPage';
import DataTablePage from './pages/DataTablePage';
import SignInPage from './pages/SignInPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar />}>
          <Route
            element={<ProtectedRoute element={DashboardPage} />}
            path='/dashboard'
          />
          <Route
            element={<ProtectedRoute element={DataTablePage} />}
            path='/data-table'
          />
        </Route>

        <Route element={<SignInPage />} path='/sign-in' />
        <Route element={<RegisterPage />} path='/' />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
