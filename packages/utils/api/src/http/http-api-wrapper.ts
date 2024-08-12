import pino, { transport } from "pino";
import { z } from "zod";

/* -------------------------------------------------------------------------------------------------
 * API WRAPPER - SCHEMAS
 * -----------------------------------------------------------------------------------------------*/

export interface BaseAPIClientOptions {
  baseURL: string;
  apiKey?: string;
  logger?: pino.Logger | null;
  id?: string;
  connectOnInit?: boolean;
}

export interface QueueTask<T = unknown> {
  id: string;
  data: T;
  status: "pending" | "running" | "completed" | "failed";
  onComplete?: () => Promise<void>;
  onProgress?: (progress: number) => void;
  onError?: (error: unknown) => void;
}

/* -------------------------------------------------------------------------------------------------
 * API WRAPPER - CLASSES
 * -----------------------------------------------------------------------------------------------*/

export abstract class BaseAPIWrapper {
  protected _baseURL: URL;
  protected _apiKey?: string;
  protected _logger: pino.Logger;
  protected _status: "connected" | "connecting" | "disconnected" =
    "disconnected";
  protected _lastSuccess: Date | null = null;
  protected _id: string;
  protected _tasks: Record<string, QueueTask> = {};
  protected _currentTaskId: string | null = null;

  constructor(options: BaseAPIClientOptions) {
    this._baseURL = new URL(options.baseURL);
    this._apiKey = options.apiKey;
    this._logger = options.logger
      ? options.logger.child({
          module: "api-wrapper",
          id: options.id,
        })
      : pino({
          level: "error",
          transport: { target: "pino-pretty", options: { colorize: true } },
        });
    this._id = options.id ?? `api-client-${Date.now()}`;
    if (options.connectOnInit) {
      this.connect();
    }
  }

  /**
   * Connects to the API.
   */
  abstract connect(): Promise<void>;

  /**
   * Disconnects from the API.
   */
  abstract disconnect(): void;

  /**
   * Executes a task.
   * @param task - The task to execute.
   */
  abstract execute(task: QueueTask): Promise<void>;

  /**
   * Returns the URL of the API endpoint.
   * @param route - The route to fetch from.
   * @returns The URL of the API endpoint.
   */
  protected getUrl(route?: string): URL {
    return new URL(route ?? "", this._baseURL);
  }

  /**
   * Returns the time since the last successful request.
   * @returns The time since the last successful request.
   */
  protected get lastAlive(): number | null {
    if (!this._lastSuccess) return null;
    return Date.now() - this._lastSuccess.getTime();
  }

  /**
   * Updates the last successful request time.
   */
  protected updateLastSuccess(): void {
    this._lastSuccess = new Date();
  }

  /**
   * Fetches data from the API and returns it as a parsed object.
   * @param route - The route to fetch from.
   * @param options - The options to pass to the fetch function.
   * @param schema - The schema to parse the response with.
   * @returns The parsed response.
   */
  protected async fetcher<T>(
    route: string,
    options: RequestInit,
    schema: z.ZodSchema<T>,
  ): Promise<T> {
    const url = this.getUrl(route);
    const headers = new Headers(options.headers);
    if (this._apiKey) {
      headers.set("Authorization", `Bearer ${this._apiKey}`);
    }

    try {
      this._logger.info(options, `Requesting ${route}`);
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        // If we get a 401, we disconnect and reconnect
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this._logger.info(data, `Response for ${route}`);
      this.updateLastSuccess();
      return schema.parse(data);
    } catch (error) {
      // If the error is a network error, we disconnect and reconnect
      if (error instanceof Error && error.message.includes("Network Error")) {
        this.disconnect();
        this.connect();
      }
      this._logger.error(error, `Fetch error for route ${route}`);
      throw error;
    }
  }

  /**
   * Returns the current status of the API client.
   * @returns The current status of the API client.
   */
  public getStatus(): string {
    return this._status;
  }

  /**
   * Returns the current task being processed by the API client.
   * @returns The current task being processed by the API client.
   */
  public getCurrentTask(): QueueTask | null {
    return this._currentTaskId
      ? (this._tasks[this._currentTaskId] ?? null)
      : null;
  }

  /**
   * Adds a task to the queue of tasks to be processed by the API client.
   * @param task - The task to add to the queue.
   */
  public addTask(task: QueueTask): void {
    this._logger.info(task, `Adding task ${task.id} to queue`);
    this._tasks[task.id] = task;
  }

  /**
   * Processes the queue of tasks to be processed by the API client.
   */
  public async processQueue(): Promise<void> {
    for (const taskId in this._tasks) {
      const task = this._tasks[taskId];
      if (task && task.status === "pending") {
        this._currentTaskId = taskId;
        task.status = "running";
        try {
          await this.execute(task);
          task.status = "completed";
          await task.onComplete?.();
        } catch (error) {
          task.status = "failed";
          this._logger.error(`Task ${taskId} failed:`, error);
          task.onError?.(error);
        }
        this._currentTaskId = null;
      }
    }
  }
}
