import { Model } from "@openclaw/core";

export class OpenAI implements Model {
  private apiKey: string;
  private defaultModel: string;

  constructor(config: { apiKey?: string; model?: string } = {}) {
    this.apiKey = config.apiKey || "mock-openai-key";
    this.defaultModel = config.model || "gpt-4o";
  }

  async generate(prompt: string, options?: any): Promise<string> {
    const selectedModel = options?.model || this.defaultModel;
    return `[OpenAI ${selectedModel}] processed prompt: "${prompt}"`;
  }
}

export class Claude implements Model {
  private apiKey: string;
  private defaultModel: string;

  constructor(config: { apiKey?: string; model?: string } = {}) {
    this.apiKey = config.apiKey || "mock-claude-key";
    this.defaultModel = config.model || "claude-3-5-sonnet";
  }

  async generate(prompt: string, options?: any): Promise<string> {
    const selectedModel = options?.model || this.defaultModel;
    return `[Claude ${selectedModel}] processed prompt: "${prompt}"`;
  }
}

export class Gemini implements Model {
  private apiKey: string;
  private defaultModel: string;

  constructor(config: { apiKey?: string; model?: string } = {}) {
    this.apiKey = config.apiKey || "mock-gemini-key";
    this.defaultModel = config.model || "gemini-1.5-pro";
  }

  async generate(prompt: string, options?: any): Promise<string> {
    const selectedModel = options?.model || this.defaultModel;
    return `[Gemini ${selectedModel}] processed prompt: "${prompt}"`;
  }
}

export class Local implements Model {
  private endpoint: string;
  private defaultModel: string;

  constructor(config: { endpoint?: string; model?: string } = {}) {
    this.endpoint = config.endpoint || "http://localhost:11434";
    this.defaultModel = config.model || "llama3";
  }

  async generate(prompt: string, options?: any): Promise<string> {
    const selectedModel = options?.model || this.defaultModel;
    return `[Local ${selectedModel} at ${this.endpoint}] processed prompt: "${prompt}"`;
  }
}
