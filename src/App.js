import axios from 'axios';
import './App.css';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useCallback, useEffect } from 'react';

const BASE_URL = "http://127.0.0.1:5000"

function App() {

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleRecaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not available yet");
      return;
    }

    const token = await executeRecaptcha('someAction');
    console.log(token);
  }, [executeRecaptcha]);

  useEffect(() => {
    handleRecaptchaVerify();
  }, [handleRecaptchaVerify]);

  const testRequest = async () => {
    const resp = await axios.get(`${BASE_URL}/test`);
    console.log(resp);
  };
  return (
    <button onClick={testRequest}></button>
  );
}

export default App;
