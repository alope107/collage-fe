import PropTypes from "prop-types";

import dnaLoad from "./assets/dnaLoad.gif";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ProgressDisplay = ({ finished, resetCallback }) => {
  let content;

  if (finished) {
    content = (
      <>
        <h1>Result Downloaded!</h1>
        <Button onClick={resetCallback} className="mt-3" variant="primary">
          Compute another?
        </Button>
      </>
    );
  } else {
    content = (
      <>
        <h1>Computing...</h1>
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
  finished: PropTypes.bool.isRequired,
  resetCallback: PropTypes.func.isRequired,
};

export default ProgressDisplay;
