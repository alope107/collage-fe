import axios from "axios";
import "./App.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback, useEffect, useState } from "react";
import JobRequestForm from "./JobRequestForm";
import useInterval from "./hooks/useInterval";
import listSpecies from "./species";
import Container from "react-bootstrap/Container";
import ProgressDisplay from "./ProgressDisplay";

const JOB_REQUEST_URL = process.env.REACT_APP_JOB_REQUEST_URL;
const RESULT_URL = process.env.REACT_APP_RESULT_URL;
const RETRY_WAIT = process.env.REACT_APP_RETRY_WAIT;

const endpoint = (objectId) => `${RESULT_URL}/${objectId}`;

function App() {
  const [finished, updateFinished] = useState(false);
  const [jobId, updateJobId] = useState(null);
  const [speciesList, updateSpeciesList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      updateSpeciesList(await listSpecies());
    };
    fetch();
  }, []);

  useInterval(
    () => {
      fetchResult(jobId);
    },
    // Begin polling every RETRY_WAIT ms if there's a jobId but not a result
    // Stop polling when a result arrives
    jobId && !finished ? RETRY_WAIT : null
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

  const fetchResult = async (objectId) => {
    const outputUrl = endpoint(objectId);
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

    updateFinished(true);
  };

  const reset = () => {
    // TODO(auberon): Investigate whether new recaptcha token is needed.
    updateFinished(false);
    updateJobId(null);
  };

  let content;

  if (!jobId) {
    content = (
      <JobRequestForm
        jobRequestCallback={verifyAndRequest}
        canSubmit={executeRecaptcha !== undefined}
        speciesList={speciesList}
      />
    );
  } else {
    content = <ProgressDisplay finished={finished} resetCallback={reset} />;
  }

  return (
    <Container
      fluid
      className="d-flex h-100 bg-light"
      style={{ minHeight: "100vh" }}
    >
      {content}
    </Container>
  );
}

export default App;
