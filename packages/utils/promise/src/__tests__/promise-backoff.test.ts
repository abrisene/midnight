import { backoff, BackoffOptions } from "../promise-backoff";

describe("backoff", () => {
  // Mock the global setTimeout function
  jest.useFakeTimers();

  it("should resolve immediately if the promise succeeds on the first try", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");
    const result = await backoff(mockFn);
    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should retry and eventually succeed", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockRejectedValueOnce(new Error("Fail 2"))
      .mockResolvedValue("success");

    const result = await backoff(mockFn, { maxRetries: 3, backoff: 5 });
    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(3);
  }, 10000);

  it("should throw an error when max retries are reached", async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error("Always fail"));

    await expect(
      backoff(mockFn, { maxRetries: 3, backoff: 5 }),
    ).rejects.toThrow("Max retries reached");
    expect(mockFn).toHaveBeenCalledTimes(4); // Initial attempt + 3 retries
  }, 10000);

  it("should use custom backoff options", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("Fail"))
      .mockResolvedValue("success");

    const options: BackoffOptions = {
      backoff: 100,
      maxRetries: 2,
      backoffFactor: 2,
      name: "CustomTest",
      onRetry: jest.fn(),
    };

    const result = await backoff(mockFn, options);
    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(options.onRetry).toHaveBeenCalledTimes(1);
    expect(options.onRetry).toHaveBeenCalledWith(1, 300, "CustomTest");
  }, 10000);

  it("should increase backoff time exponentially", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockRejectedValueOnce(new Error("Fail 2"))
      .mockRejectedValueOnce(new Error("Fail 3"))
      .mockResolvedValue("success");

    const onRetry = jest.fn();
    await backoff(mockFn, {
      backoff: 100,
      maxRetries: 5,
      backoffFactor: 2,
      onRetry,
    });

    expect(onRetry).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, 300, undefined);
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, 900, undefined);
    expect(onRetry).toHaveBeenNthCalledWith(3, 3, 1900, undefined);
  }, 10000);
});
