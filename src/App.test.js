import axios from "axios";
import { render, screen } from "@testing-library/react";
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

beforeEach(() => {
  axiosGet.mockReset();
  mockExecuteRecaptcha.mockReset();
});

test("renders without crashing", () => {
  render(<App />);
});
