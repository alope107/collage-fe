import axios from "axios";
import "./App.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback } from "react";
import JobRequestForm from "./JobRequestForm";

const JOB_REQUEST_URL = process.env.REACT_APP_JOB_REQUEST_URL;

function App() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const verifyAndRequest = useCallback(async () => {
    const token = await executeRecaptcha("someAction");
    testRequest(token);
  }, [executeRecaptcha]);

  const testRequest = async (token) => {
    console.log(JOB_REQUEST_URL);
    const resp = await axios.post(`${JOB_REQUEST_URL}/request/`, {
      token: token,
    });
    console.log(resp);
  };

  return (
    <>
      <button
        onClick={verifyAndRequest}
        disabled={executeRecaptcha === undefined}
      >
        Do a thing
      </button>
      <JobRequestForm jobRequestCallback={console.log}></JobRequestForm>
    </>
  );
}

export default App;
