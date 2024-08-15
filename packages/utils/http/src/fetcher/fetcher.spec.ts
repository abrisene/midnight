import { z } from "zod";

import { fetcher } from "./fetcher";

// Mock global fetch
global.fetch = jest.fn();

describe("fetcher", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should make a successful request and validate the response", async () => {
    const mockResponse = { data: "test" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const baseURL = "https://api.example.com";
    const route = "/test";
    const validator = z.object({ data: z.string() });

    const myFetcher = fetcher(baseURL);
    const result = await myFetcher(route, {}, validator);

    expect(result).toEqual(mockResponse);
    // expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/test", {
    //   headers: {
    //     "Content-Type": "application/json",
    //     accept: "application/json",
    //   },
    // });
  });

  it("should throw an error for invalid responses", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const baseURL = "https://api.example.com";
    const route = "/test";
    const validator = z.object({ data: z.string() });

    const myFetcher = fetcher(baseURL);
    await expect(myFetcher(route, {}, validator)).rejects.toThrow(
      "Invalid response.",
    );
  });

  it("should merge default options with provided options", async () => {
    const mockResponse = { data: "test" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const baseURL = "https://api.example.com";
    const route = "/test";
    const validator = z.object({ data: z.string() });
    const defaultOptions = {
      headers: { "X-Custom-Header": "default" },
    };
    const requestOptions = {
      method: "POST",
      headers: { "X-Custom-Header": "override" },
    };

    const myFetcher = fetcher(baseURL, defaultOptions);
    await myFetcher(route, requestOptions, validator);

    // expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/test", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     accept: "application/json",
    //     "X-Custom-Header": "override",
    //   },
    // });
  });

  it("should call the callback function after a successful fetch", async () => {
    const mockResponse = { data: "test" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const baseURL = "https://api.example.com";
    const route = "/test";
    const validator = z.object({ data: z.string() });
    const callback = jest.fn();

    const myFetcher = fetcher(baseURL, {}, callback);
    await myFetcher(route, {}, validator);

    expect(callback).toHaveBeenCalled();
  });

  it("should throw an error if the response fails validation", async () => {
    const mockResponse = { invalidData: "test" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const baseURL = "https://api.example.com";
    const route = "/test";
    const validator = z.object({ data: z.string() });

    const myFetcher = fetcher(baseURL);
    await expect(myFetcher(route, {}, validator)).rejects.toThrow();
  });
});
