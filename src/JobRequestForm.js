import PropTypes from "prop-types";
import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const INITIAL_FORM_DATA = {
  fasta: "",
  species: "",
};

const JobRequestForm = ({ jobRequestCallback, canSubmit, speciesList }) => {
  const [requestData, setRequestData] = useState(INITIAL_FORM_DATA);

  // Can only submit if externally permitted and all data is selected.
  canSubmit = canSubmit && requestData.fasta && requestData.species;

  const fastaUploadRef = useRef();

  const submitJobRequest = (e) => {
    e.preventDefault();
    jobRequestCallback(requestData);
    setRequestData(INITIAL_FORM_DATA);
    fastaUploadRef.current.value = "";
  };

  const speciesOptions = [
    <option key="" value="" disabled />,
    ...speciesList.map((speciesName) => (
      <option value={speciesName} key={speciesName}>
        {speciesName}
      </option>
    )),
  ];

  return (
    <Container fluid className="d-flex h-100">
      <Row className="justify-content-center align-self-center w-100">
        <Col xs={12} md={6} lg={4} className="text-center">
          <Form onSubmit={submitJobRequest}>
            <Form.Group controlId="fasta" className="mb-3">
              <Form.Label>FASTA</Form.Label>
              <Form.Control
                type="file"
                ref={fastaUploadRef}
                onChange={(e) => {
                  setRequestData({
                    ...requestData,
                    fasta: e.target.files[0],
                  });
                }}
              />
            </Form.Group>

            <Form.Group controlId="species">
              <Form.Label>Species</Form.Label>
              <Form.Select
                value={requestData.species}
                onChange={(e) => {
                  setRequestData({ ...requestData, species: e.target.value });
                }}
              >
                {speciesOptions}
              </Form.Select>
            </Form.Group>

            <Button
              type="submit"
              variant={canSubmit ? "primary" : "secondary"}
              disabled={!canSubmit}
            >
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

JobRequestForm.propTypes = {
  jobRequestCallback: PropTypes.func.isRequired,
  canSubmit: PropTypes.bool.isRequired,
  speciesList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default JobRequestForm;
