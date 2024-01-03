import PropTypes from "prop-types";

import dnaTwirl from "./assets/dnaTwirl.gif";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ProgressDisplay = ({ finished, resetCallback }) => {
  let content;

  if (finished) {
    content = (
      <>
        <h1>Result Downloaded!</h1>
        <Button onClick={resetCallback} variant="primary">
          Compute another?
        </Button>
      </>
    );
  } else {
    content = (
      <>
        <h1>Computing...</h1>
        <img
          src={dnaTwirl}
          className="img-fluid"
          alt="Spinning DNA loading icon"
        ></img>
      </>
    );
  }

  // TODO(auberon): Display image attribution: https://commons.wikimedia.org/wiki/File:DNA_Orbit_Animated_Clean.gif

  return (
    <Row className="justify-content-center align-self-center w-100">
      <Col
        xs={12}
        sm={8}
        md={6}
        lg={4}
        className="text-center bg-white p-4 border rounded fs-4 fw-bold"
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
