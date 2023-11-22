import axios from "axios";
import "./App.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback, useState } from "react";
import JobRequestForm from "./JobRequestForm";
import useInterval from "./hooks/useInterval";

const endpoint = (bucket, region, objectId) =>
  `https://${bucket}.s3.${region}.amazonaws.com/output/${objectId}`;

const JOB_REQUEST_URL = process.env.REACT_APP_JOB_REQUEST_URL;
const RESULT_BUCKET = process.env.REACT_APP_BUCKET;
const RESULT_REGION = process.env.REACT_APP_REGION;

function App() {
  const [result, updateResult] = useState("");
  const [jobId, updateJobId] = useState(null);

  useInterval(
    () => {
      fetchResult(RESULT_BUCKET, RESULT_REGION, jobId);
    },
    // Begin polling every 10sec if there's a jobId but not a result
    // Stop polling when a result arrives
    jobId && !result ? 10000 : null
  );

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
    updateJobId(resp.data.id);
  };

  const fetchResult = async (bucket, region, objectId) => {
    const outputUrl = endpoint(bucket, region, objectId);
    console.log(`Fetchin ${outputUrl}`);
    let resp;
    try {
      resp = await axios.get(outputUrl, {
        responseType: "blob",
      });
    } catch (e) {
      console.log(e);
      return;
    }

    console.log(resp);

    // Create an in-memory file for the downloaded data
    const file = new Blob([resp.data], {
      type: "application/octet-stream",
    });
    const fileUrl = URL.createObjectURL(file);

    // Unfortunate JS jank: create an <a> and trigger a download.
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", `${objectId}.fasta`);
    document.body.appendChild(link);
    link.click();

    // Clean up the jank
    link.parentNode.removeChild(link);
    URL.revokeObjectURL(fileUrl);

    // TODO(auberon): Make more informative?
    updateResult("Got it!");
  };

  return (
    <>
      <JobRequestForm
        jobRequestCallback={verifyAndRequest}
        canSubmit={executeRecaptcha !== undefined}
      ></JobRequestForm>
      <button onClick={() => fetchResult(RESULT_BUCKET, RESULT_REGION, jobId)}>
        Fetch the output for {jobId}!!!!
      </button>
      {result}
    </>
  );
}

export default App;
