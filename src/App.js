import axios from "axios";
import "./App.css";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import JobRequestForm from "./JobRequestForm";
import listSpecies from "./species";
import Container from "react-bootstrap/Container";
import ProgressDisplay from "./ProgressDisplay";

const JOB_REQUEST_URL = process.env.REACT_APP_JOB_REQUEST_URL;
const RESULT_URL = process.env.REACT_APP_RESULT_URL;
const STATUS_URL = process.env.REACT_APP_STATUS_URL;
const RETRY_WAIT = process.env.REACT_APP_RETRY_WAIT;

const resultEndpoint = (objectId) => `${RESULT_URL}/${objectId}`;
const statusEndpoint = (objectId) => `${STATUS_URL}/${objectId}.json`;

// TODO(auberon): Refactor app so retrier prop is not needed at top level
function App({retrier}) {
  // TODO(auberon): Consolidate all this state into a single object?
  const [jobId, updateJobId] = useState(null);
  const [speciesList, updateSpeciesList] = useState([]);
  const [status, updateStatus] = useState("");
  const [statusReason, updatestatusReason] = useState("");

  useEffect(() => {
    const fetch = async () => {
      updateSpeciesList(await listSpecies());
    };
    fetch();
  }, []);

  retrier(
    () => {
      fetchStatus(jobId);
    },
    // Begin polling every RETRY_WAIT ms if there's a jobId but not a result
    // Stop polling when a result arrives
    (jobId && status !== "SUCCEEDED" && status !== "FAILED") ? RETRY_WAIT : null
  );

  const { executeRecaptcha } = useGoogleReCaptcha();

  const verifyAndRequest = useCallback(
    async (data) => {
      const token = await executeRecaptcha("someAction");
      requestJob({ ...data, token: token });
    },
    [executeRecaptcha]
  );

  const requestJob = async (data) => {
    console.log(JOB_REQUEST_URL);

    const formData = new FormData();
    formData.append("fasta", data.fasta);
    formData.append("species", data.species);
    formData.append("token", data.token);

    updateStatus("SUBMITTED");
    const resp = await axios.post(`${JOB_REQUEST_URL}/request/`, formData);
    console.log(resp);
    updateJobId(resp.data.id);
  };

  const fetchStatus = async (jobId) => {
    const statusUrl = statusEndpoint(jobId);
    console.log(`Checking status: ${statusUrl}`);

    let resp;
    try {
      resp = await axios.get(statusUrl);
    } catch (e) { // TODO(auberon): Have this check specifically for a 403 (No status object if job has not been moved into queue yet)
      console.log(e);
      return;
    }

    console.log(resp);

    const statusInfo = resp.data;
    updateStatus(statusInfo.status);
    if (statusInfo.statusReason) {
      updatestatusReason(statusInfo.statusReason);
    }

    if (statusInfo.status === "SUCCEEDED") {
      fetchResult(jobId);
    }
  };

  const fetchResult = async (objectId) => {
    const outputUrl = resultEndpoint(objectId);
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
  };

  const reset = () => {
    // TODO(auberon): Investigate whether new recaptcha token is needed.
    updateJobId(null);
    updateStatus("");
    updatestatusReason("");
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
    content = <ProgressDisplay status={status} resetCallback={reset} statusReason={statusReason}/>;
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark">
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center flex-grow-1"
      >
        {content}
      </Container>
      <footer className="mt-auto py-3">
        <div className="text-center text-light" style={{ fontSize: "0.8rem" }}>
          <a
            className="text-secondary"
            href="https://commons.wikimedia.org/wiki/File:DNA_Sequence_Flat_Icon_GIF_Animation.gif"
          >
            DNA GIF
          </a>{" "}
          from{" "}
          <a
            className="text-secondary"
            href="https://commons.wikimedia.org/wiki/Main_Page"
          >
            Wikimedia Commons
          </a>{" "}
          by{" "}
          <a className="text-secondary" href="https://videoplasty.com/">
            Videoplasty.com
          </a>
          ,{" "}
          <a
            className="text-secondary"
            href="https://creativecommons.org/licenses/by-sa/4.0/deed.en"
          >
            CC-BY-SA 4.0
          </a>
        </div>
      </footer>
    </div>
  );
}

App.propTypes = {
  retrier: PropTypes.func.isRequired,
};

export default App;
