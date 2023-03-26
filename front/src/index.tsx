import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';
import { BrowserRouter, Route, Routes, } from 'react-router-dom';
import Profile from './components/Profile';
import DailyFlights from './components/DailyFlights';
import ProfileManage from './components/ProfileManage';
import E404 from './components/404';
import Landing from './components/Landing';
import SingleFlight from './components/SingleFlight';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Landing/>} />
          <Route path='resetPassword' element={<App />} />
          <Route path='profile' element={<Profile />} />
          <Route path='manageProfiles' element={<ProfileManage />} />
          <Route path='flights'>
            <Route index element={<DailyFlights />}/>
            <Route path=':flightId' element={<SingleFlight />} />
          </Route>
        </Route>
        <Route path='*' element={<E404 />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
