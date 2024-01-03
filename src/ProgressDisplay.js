import PropTypes from "prop-types";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ProgressDisplay = ({ finished, resetCallback }) => {
  let content;

  if (finished) {
    content = (
      <>
        <div>Result Downloaded!</div>
        <Button onClick={resetCallback} variant="primary">
          Compute another?
        </Button>
      </>
    );
  } else {
    content = <>Computing...</>;
  }

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
