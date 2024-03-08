import axios from "axios";
import { fireEvent, render, waitFor } from "@testing-library/react";
import App from "./App";

const mockExecuteRecaptcha = jest.fn();

// Adapted from: https://github.com/t49tran/react-google-recaptcha-v3/issues/123
jest.mock("react-google-recaptcha-v3", () => {
  return {
    GoogleReCaptchaProvider: ({ children }) => {
      return <>{children}</>;
    },
    useGoogleReCaptcha: () => ({
      executeRecaptcha: mockExecuteRecaptcha,
    }),
  };
});

jest.mock("axios");
const axiosGet = axios.get;
const axiosPost = axios.post;

const mockBlob = jest.fn();
global.Blob = mockBlob;

const mockCreateObjectURL = jest.fn();
global.URL.createObjectURL = mockCreateObjectURL;

const mockRevokeObjectURL = jest.fn();
global.URL.revokeObjectURL = mockRevokeObjectURL;

beforeEach(() => {
  jest.useFakeTimers();
  axiosGet.mockReset();
  axiosPost.mockReset();
  mockExecuteRecaptcha.mockReset();
  mockBlob.mockReset();
  mockCreateObjectURL.mockReset();
  mockRevokeObjectURL.mockReset();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test("renders without crashing", () => {
  render(<App />);
});


// Issues with mocking timers is preventing test from fully exercising code.
// TODO(auberon): Fix this.
test("form is submitted properly", async () => {
  // Mocked when recaptcha is first initialized
  mockExecuteRecaptcha.mockResolvedValue("mockToken");

  // Mocked when job is submitted
  axiosPost.mockResolvedValue({
    status: 200,
    data: {
      is_valid: true,
      id: "mockId",
    },
  });

  axiosGet.mockResolvedValue({ data: {status: "RUNNABLE"} });

  

  const { getByLabelText, getByText } = render(<App />);

  // Give time for the species to be fetched
  await waitFor(() => {
    expect(getByText("Ecoli")).toBeInTheDocument();
  });

  const fastaInput = getByLabelText("FASTA");
  const fastaFile = new File(["mockFastaData"], "fasta.txt", {
    type: "text/plain",
  });
  fireEvent.change(fastaInput, { target: { files: [fastaFile] } });

  const speciesSelect = getByLabelText("Species");
  fireEvent.change(speciesSelect, { target: { value: "Ecoli" } });

  const submitButton = getByText("Submit");
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(axiosPost).toHaveBeenCalledTimes(1);
  });
  const [actualUrl, actualFormData] = axiosPost.mock.calls[0];
  expect(actualUrl).toEqual("https://mock-job-request.url/request/");

  const expectedFormObject = {
    fasta: fastaFile,
    token: "mockToken",
    species: "Ecoli",
  };

  const actualFormObject = Object.fromEntries(actualFormData.entries());

  // TODO(auberon):
  // toEqual does not properly check the contents of the file uploaded
  // consider moving to another method that actually checks the file data
  expect(actualFormObject).toEqual(expectedFormObject);
  jest.advanceTimersByTime(1001);

  await waitFor(() => {
    expect(axiosGet).toBeCalled();
  });

  let actualGetUrl = axiosGet.mock.calls[0][0];
  expect(actualGetUrl).toEqual(
    "https://mock-bucket.s3.mock-region.amazonaws.com/status/mockId.json"
  );
  jest.advanceTimersByTime(1001);

  axiosGet.mockReset();

  axiosGet.mockResolvedValue({ data: {status: "RUNNABLE"} });
  

  await waitFor(() => {
    expect(axiosGet).toBeCalled();
  });

  jest.advanceTimersByTime(1001);
  actualGetUrl = axiosGet.mock.calls[0][0];
  expect(actualGetUrl).toEqual(
    "https://mock-bucket.s3.mock-region.amazonaws.com/status/mockId.json"
  );

  axiosGet.mockReset();

  axiosGet.mockResolvedValue({ data: {status: "SUCCEEDED"} });
  jest.advanceTimersByTime(1001);

  await waitFor(() => {
    expect(axiosGet).toBeCalled();
  });


  // TODO(auberon): Reenable this once mock timers are working properly.
  
  // actualGetUrl = axiosGet.mock.calls[0][0];
  // expect(actualGetUrl).toEqual(
  //   "https://mock-bucket.s3.mock-region.amazonaws.com/output/mockId"
  // );

  // // Mocked when results are fetched
  // axiosGet.mockResolvedValue({ data: "mock-file-data" });
});
