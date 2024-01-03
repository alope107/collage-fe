import PropTypes from "prop-types";
import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const INITIAL_FORM_DATA = {
  fasta: "",
  species: "",
};

const JobRequestForm = ({ jobRequestCallback, canSubmit, speciesList }) => {
  const [requestData, setRequestData] = useState(INITIAL_FORM_DATA);

  const fastaUploadRef = useRef();

  const submitJobRequest = (e) => {
    e.preventDefault();
    jobRequestCallback(requestData);
    setRequestData(INITIAL_FORM_DATA);
    fastaUploadRef.current.value = "";
  };

  const speciesOptions = speciesList.map((speciesName) => (
    <option value={speciesName} key={speciesName}>
      {speciesName}
    </option>
  ));

  return (
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
  );
};

JobRequestForm.propTypes = {
  jobRequestCallback: PropTypes.func.isRequired,
  canSubmit: PropTypes.bool.isRequired,
  speciesList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default JobRequestForm;
