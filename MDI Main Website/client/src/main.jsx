import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx';
import InstructorProvider from './context/InstructorContext';
import StudentProvider from './context/StudentContext';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <InstructorProvider>
        <StudentProvider>
          <App />
        </StudentProvider>
      </InstructorProvider>
    </AppContextProvider>
  </BrowserRouter>

);
