export interface NommyOptions extends RequestInit {
  baseURL?: string;
  timeout?: number;
}

export interface NommyResponse<T = any> extends Response {
  data?: T;
}

export class NommyError extends Error {
  response?: Response;
  status?: number;

  constructor(message: string, response?: Response) {
    super(message);
    this.name = 'NommyError';
    this.response = response;
    this.status = response?.status;
  }
}

export class Nommy {
  private baseURL: string;
  private defaultOptions: NommyOptions;

  constructor(options: NommyOptions = {}) {
    this.baseURL = options.baseURL || '';
    this.defaultOptions = options;
  }

  async fetch<T>(url: string, options: NommyOptions = {}): Promise<NommyResponse<T>> {
    const fullURL = this.baseURL + url;
    const timeout = options.timeout || this.defaultOptions.timeout;

    const controller = new AbortController();
    const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

    try {
      const response = await fetch(fullURL, {
        ...this.defaultOptions,
        ...options,
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        throw new NommyError(`HTTP error! status: ${response.status}`, response);
      }

      const data = await response.json();
      (response as NommyResponse).data = data;

      return response as NommyResponse<T>;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      throw error instanceof NommyError ? error : new NommyError(String(error));
    }
  }

  get<T>(url: string, options?: NommyOptions) {
    return this.fetch<T>(url, { ...options, method: 'GET' });
  }

  post<T>(url: string, data?: any, options?: NommyOptions) {
    return this.fetch<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  }

  // Add other methods (put, delete, patch) as needed
}

export default Nommy;
