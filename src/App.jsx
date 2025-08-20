import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './views/dashboard/Dashboard';
import Login from './views/login/Login';
import Signup from './views/signup/Signup';
import OryProvider from './Providers/OryProvider';

function App() {
  const router = createBrowserRouter([{
    path: '/',
    Component: Dashboard
  }, {
    path: '/login',
    Component: Login
  }, {
    path: '/signup',
    Component: Signup
  }]);

  return (
    <>
    {/* <OryProvider>
    </OryProvider> */}
      <RouterProvider router={router} />
    </>
  )
}

export default App
