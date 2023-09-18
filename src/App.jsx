import './App.css'
import TempForm from './components/tempForm'
import Login from './components/Login'
import EditEmail from './components/EditEmail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TempForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/edit" element={<EditEmail />} />
      </Routes>
    </Router>
  )
}

export default App
