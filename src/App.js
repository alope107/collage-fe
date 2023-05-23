import axios from 'axios';
import './App.css';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useCallback, useEffect, useState } from 'react';

const BASE_URL = "http://127.0.0.1:5000"

function App() {

  const [token, setToken] = useState(null);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleRecaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not available yet");
      return;
    }

    const token = await executeRecaptcha('someAction');
    setToken(token);
    console.log(token);
  }, [executeRecaptcha]);

  useEffect(() => {
    handleRecaptchaVerify();
  }, [handleRecaptchaVerify]);

  const testRequest = async () => {
    const resp = await axios.post(`${BASE_URL}/test`,{
      token: token
    });
    console.log(resp);
  };


  return (
    <button onClick={testRequest} disabled={token == null}> Do a thing </button>
  );
}

export default App;
