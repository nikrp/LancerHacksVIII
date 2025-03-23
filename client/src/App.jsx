import axios from 'axios';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import AuthenticationPage from './AuthenticationPage';
import Dashboard from './Dashboard';
import { WiMoonAltThirdQuarter } from "react-icons/wi";

const supabase = createClient('https://zcjloxxwqjeijixajqyx.supabase.co', import.meta.env.VITE_ANON);
function App() {
  const [theme, setTheme] = useState(true);

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
    <div data-theme={theme ? `green` : `darkblue`}>
      <button className={`btn btn-circle btn-neutral fixed top-5 right-5`} onClick={() => setTheme(!theme)}>
        <WiMoonAltThirdQuarter size={25} className={`m-2.5`}/>
      </button>
      <Routes>
        <Route path={`/`} element={<AuthenticationPage supabase={supabase} />} />
        <Route path={`/dashboard`} element={<Dashboard supabase={supabase} />} />
      </Routes>
    </div>
  )
}

export default App
