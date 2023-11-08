import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";

const endpoint = (bucket, region, objectId) =>
  `https://${bucket}.s3.${region}.amazonaws.com/output/${objectId}`;

const ResultFetcher = ({ bucket, region, objectId }) => {
  const outputUrl = endpoint(bucket, region, objectId);
  const [result, updateResult] = useState("Waiting for result...");
  const fetchIt = async () => {
    console.log(`Fetchin ${outputUrl}`);
    const resp = await axios.get(outputUrl);
    console.log(resp);
    updateResult(resp.data);
  };
  return (
    <>
      <button onClick={fetchIt}>Fetch the output!</button>
      {result}
    </>
  );
};

ResultFetcher.propTypes = {
  bucket: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  objectId: PropTypes.string.isRequired,
};

export default ResultFetcher;
