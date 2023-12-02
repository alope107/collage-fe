import PropTypes from "prop-types";
import { useRef, useState } from "react";

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
    <form onSubmit={submitJobRequest}>
      <label htmlFor="fasta">FASTA</label>
      <input
        id="fasta"
        type="file"
        name="fasta"
        ref={fastaUploadRef}
        onChange={(e) => {
          setRequestData({
            ...requestData,
            fasta: e.target.files[0],
          });
        }}
      />
      <label htmlFor="species">Species</label>
      <select
        id="species"
        name="species"
        value={requestData.species}
        onChange={(e) => {
          setRequestData({ ...requestData, species: e.target.value });
        }}
      >
        {speciesOptions}
      </select>

      <button type="submit" disabled={!canSubmit}>
        Submit
      </button>
    </form>
  );
};

JobRequestForm.propTypes = {
  jobRequestCallback: PropTypes.func.isRequired,
  canSubmit: PropTypes.bool.isRequired,
  speciesList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default JobRequestForm;
