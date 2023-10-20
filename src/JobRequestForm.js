import PropTypes from "prop-types";
import { useRef, useState } from "react";

const INITIAL_FORM_DATA = {
  fasta: "",
  species: "",
};

const JobRequestForm = ({ jobRequestCallback }) => {
  const [requestData, setRequestData] = useState(INITIAL_FORM_DATA);

  const fastaUploadRef = useRef();

  const submitJobRequest = (e) => {
    e.preventDefault();
    jobRequestCallback(requestData);
    setRequestData(INITIAL_FORM_DATA);
    fastaUploadRef.current.value = "";
  };

  return (
    <form onSubmit={submitJobRequest}>
      <label htmlFor="fasta">FASTA</label>
      <input
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
      <input
        name="species"
        value={requestData.species}
        onChange={(e) =>
          setRequestData({ ...requestData, species: e.target.value })
        }
      />
      <button type="submit">Submit</button>
    </form>
  );
};

JobRequestForm.propTypes = {
  jobRequestCallback: PropTypes.func.isRequired,
};

export default JobRequestForm;