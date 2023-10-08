import axios from "axios";
import "./App.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback } from "react";
import JobRequestForm from "./JobRequestForm";

const JOB_REQUEST_URL = process.env.REACT_APP_JOB_REQUEST_URL;

function App() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const verifyAndRequest = useCallback(
    async (data) => {
      const token = await executeRecaptcha("someAction");
      testRequest({ ...data, token: token });
    },
    [executeRecaptcha]
  );

  const testRequest = async (data) => {
    console.log(JOB_REQUEST_URL);

    const formData = new FormData();
    formData.append("fasta", data.fasta);
    formData.append("species", data.species);
    formData.append("token", data.token);

    const resp = await axios.post(`${JOB_REQUEST_URL}/request/`, formData);
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
      <JobRequestForm jobRequestCallback={verifyAndRequest}></JobRequestForm>
    </>
  );
}

export default App;
