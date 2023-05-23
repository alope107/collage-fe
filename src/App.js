import axios from 'axios';
import './App.css';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useCallback } from 'react';

const BASE_URL = "http://127.0.0.1:5000"

function App() {

  const { executeRecaptcha } = useGoogleReCaptcha();

  const verifyAndRequest = useCallback(async () => {
    const token = await executeRecaptcha('someAction');
    testRequest(token);
  }, [executeRecaptcha]);

  const testRequest = async (token) => {
    const resp = await axios.post(`${BASE_URL}/test`,{
      token: token
    });
    console.log(resp);
  };


  return (
    <button onClick={verifyAndRequest} disabled={executeRecaptcha === undefined}> Do a thing </button>
  );
}

export default App;
