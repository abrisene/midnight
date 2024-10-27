import pino from "pino";
import { z } from "zod";

import type { BaseAPIClientOptions, QueueTask } from "./http-api-wrapper";

import { BaseAPIWrapper } from "./http-api-wrapper";

// Mock implementation of BaseAPIWrapper for testing
class TestAPIWrapper extends BaseAPIWrapper {
  async connect(): Promise<void> {
    this._status = "connected";
  }

  disconnect(): void {
    this._status = "disconnected";
  }

  async execute(task: QueueTask): Promise<void> {
    // Simulate task execution
    await new Promise((resolve) => setTimeout(resolve, 10));
    if (task.onProgress) task.onProgress(100);
  }

  // Expose protected methods for testing
  public exposedGetUrl(route?: string): URL {
    return this.getUrl(route);
  }

  public exposedFetcher<T>(
    route: string,
    options: RequestInit,
    schema: z.ZodSchema<T>,
  ): Promise<T> {
    return this.fetcher(route, options, schema);
  }
}

describe("BaseAPIWrapper", () => {
  let wrapper: TestAPIWrapper;
  const mockOptions: BaseAPIClientOptions = {
    baseURL: "https://api.example.com",
    apiKey: "test-api-key",
    logger: pino({ level: "silent" }),
    id: "test-wrapper",
    connectOnInit: false,
  };

  beforeEach(() => {
    wrapper = new TestAPIWrapper(mockOptions);
  });

  it("should initialize with correct options", () => {
    expect(wrapper._baseURL.toString()).toBe("https://api.example.com/");
    expect(wrapper._apiKey).toBe("test-api-key");
    expect(wrapper._id).toBe("test-wrapper");
    expect(wrapper.getStatus()).toBe("disconnected");
  });

  it("should connect and disconnect", async () => {
    await wrapper.connect();
    expect(wrapper.getStatus()).toBe("connected");

    wrapper.disconnect();
    expect(wrapper.getStatus()).toBe("disconnected");
  });

  it("should add and process tasks", async () => {
    const mockTask: QueueTask = {
      id: "task1",
      data: { foo: "bar" },
      status: "pending",
      onComplete: jest.fn(),
      onProgress: jest.fn(),
    };

    wrapper.addTask(mockTask);
    expect(wrapper._tasks.task1).toBe(mockTask);

    await wrapper.processQueue();
    expect(mockTask.status).toBe("completed");
    expect(mockTask.onComplete).toHaveBeenCalled();
    expect(mockTask.onProgress).toHaveBeenCalledWith(100);
  });

  it("should handle task failures", async () => {
    const mockErrorTask: QueueTask = {
      id: "errorTask",
      data: { foo: "bar" },
      status: "pending",
      onError: jest.fn(),
    };

    wrapper.addTask(mockErrorTask);
    jest
      .spyOn(wrapper, "execute")
      .mockRejectedValueOnce(new Error("Test error"));

    await wrapper.processQueue();
    expect(mockErrorTask.status).toBe("failed");
    expect(mockErrorTask.onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should correctly form URLs", () => {
    expect(wrapper.exposedGetUrl("/test").toString()).toBe(
      "https://api.example.com/test",
    );
    expect(wrapper.exposedGetUrl().toString()).toBe("https://api.example.com/");
  });

  it("should handle fetcher method", async () => {
    const mockResponse = { data: "test" };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const schema = z.object({ data: z.string() });
    const result = await wrapper.exposedFetcher(
      "/test",
      { method: "GET" },
      schema,
    );

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Headers),
      }),
    );
  });

  it("should handle fetcher errors", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network Error"));

    const schema = z.object({ data: z.string() });
    await expect(
      wrapper.exposedFetcher("/test", { method: "GET" }, schema),
    ).rejects.toThrow("Network Error");
  });
});
