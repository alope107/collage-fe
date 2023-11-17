import axios from "axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

beforeEach(() => {
  axiosGet.mockReset();
  axiosPost.mockReset();
  mockExecuteRecaptcha.mockReset();
});

test("renders without crashing", () => {
  render(<App />);
});

test("form is submitted properly", async () => {
  mockExecuteRecaptcha.mockResolvedValue("mockToken");

  const { getByLabelText, getByText } = render(<App />);

  const fastaInput = getByLabelText("FASTA");
  const fastaFile = new File(["mockFastaData"], "fasta.txt", {
    type: "text/plain",
  });
  fireEvent.change(fastaInput, { target: { files: [fastaFile] } });

  const speciesTextBox = getByLabelText("Species");
  fireEvent.change(speciesTextBox, { target: { value: "mockSpecies" } });

  const submitButton = getByText("Submit");
  fireEvent.click(submitButton);

  axiosPost.mockResolvedValue({
    status: 200,
    data: {
      is_valid: true,
      id: "mockId",
    },
  });

  await waitFor(() => {
    expect(axiosPost).toHaveBeenCalledTimes(1);
    const [actualUrl, actualFormData] = axiosPost.mock.calls[0];
    expect(actualUrl).toEqual("https://mock-job-request.url/request/");

    const expectedFormObject = {
      fasta: fastaFile,
      token: "mockToken",
      species: "mockSpecies",
    };

    const actualFormObject = Object.fromEntries(actualFormData.entries());

    // TODO(auberon):
    // toEqual does not properly check the contents of the file uploaded
    // consider moving to another method that actually checks the file data
    expect(actualFormObject).toEqual(expectedFormObject);
  });
});
