import axios from 'axios';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import AuthenticationPage from './AuthenticationPage';
import Dashboard from './Dashboard';

const supabase = createClient('https://zcjloxxwqjeijixajqyx.supabase.co', import.meta.env.VITE_ANON);
function App() {
  useEffect(() => {
    async function test() {
      const response = await axios.get('https://api.api-ninjas.com/v1/quotes', {
        headers: {
          'X-Api-Key': "CdTqPh+WNqPRKkhWZ+akhg==qvuIFpUZ4CG77bqI",
        },
      });

      console.log(response.data);
    }

    test();
  }, []);

  return (
    <div>
      <Routes>
        <Route path={`/`} element={<AuthenticationPage supabase={supabase} />} />
        <Route path={`/dashboard`} element={<Dashboard supabase={supabase} />} />
      </Routes>
    </div>
  )
}

export default App
