import './App.css'
import TempForm from './pages/tempForm'
import Login from './pages/Login'
import EditEmail from './pages/EditEmail';
import EmailDisplay from './pages/EmailDisplay';
import Navbar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TempForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/edit" element={<EditEmail />} />
        <Route path="/email" element={<EmailDisplay />} />
      </Routes>
    </Router>
  )
}

export default App
