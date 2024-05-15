import PropTypes from "prop-types";

import dnaLoad from "./assets/dnaLoad.gif";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Mapping of AWS Batch status to more interpretable status
const PRETTY_STATUS = {
  "SUBMITTED": "Submitted",
  "PENDING": "In Queue",
  "RUNNABLE": "In Queue",
  "STARTING": "Starting",
  "RUNNING": "Running",
  "SUCCEEDED": "Succeeded",
  "FAILED": "Error"
};

const ProgressDisplay = ({ status, resetCallback, statusReason}) => {
  let content;

  switch (status) {
    case "SUCCEEDED":
      content = (
        <>
          <h1>Result Downloaded!</h1>
          <Button onClick={resetCallback} className="mt-3" variant="primary">
            Compute another?
          </Button>
        </>
      );
      break;
    case "FAILED":
      content = (
        <>
          <h1>Error</h1>
          {statusReason}
          <Button onClick={resetCallback} className="mt-3" variant="primary">
            Try again?
          </Button>
        </>
      );
      break;
    // Default is for incomplete states. Includes SUBMITTED, PENDING, RUNNING, RUNNABLE, STARTING
    // TODO(auberon): Give better state names than AWS gives us.
    default: 
      content = (
        <>
          <h1>Status: {PRETTY_STATUS[status]}</h1>
          <img src={dnaLoad} className="img-fluid" alt="DNA loading icon" />
        </>
      );
  }

  return (
    <Row className="justify-content-center align-self-center w-100">
      <Col
        xs={12}
        sm={8}
        md={6}
        lg={4}
        className="text-center bg-secondary p-4 border rounded fs-4 fw-bold text-light"
      >
        {content}
      </Col>
    </Row>
  );
};

ProgressDisplay.propTypes = {
  status: PropTypes.string.isRequired,
  resetCallback: PropTypes.func.isRequired,
  statusReason: PropTypes.string
};

export default ProgressDisplay;
