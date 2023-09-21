import PropTypes from "prop-types";
import { useState } from "react";

const INITIAL_FORM_DATA = {
  protein: "",
  species: "",
};

const JobRequestForm = ({ jobRequestCallback }) => {
  const [requestData, setRequestData] = useState(INITIAL_FORM_DATA);

  const submitJobRequest = (e) => {
    e.preventDefault();
    jobRequestCallback(requestData);
    setRequestData(INITIAL_FORM_DATA);
  };

  const handleChange = (e) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={submitJobRequest}>
      <label htmlFor="protein">Protein Sequence</label>
      <input
        name="protein"
        value={requestData.protein}
        onChange={handleChange}
      />
      <label htmlFor="species">Species</label>
      <input
        name="species"
        value={requestData.species}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

JobRequestForm.propTypes = {
  jobRequestCallback: PropTypes.func.isRequired,
};

export default JobRequestForm;
