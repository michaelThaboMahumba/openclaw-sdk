import { Tool, Context } from "@openclaw/core";

export class Browser implements Tool {
  name = "browser";
  description = "A tool to navigate websites and search inside web content.";

  async execute(args: { url: string }, context: Context): Promise<string> {
    const url = args.url || "https://example.com";
    return `[Browser] Visited ${url}. Content loaded successfully.`;
  }
}

export class Search implements Tool {
  name = "search";
  description = "A tool to query search engines for real-time information.";

  async execute(args: { query: string }, context: Context): Promise<string[]> {
    const query = args.query || "";
    return [
      `Search result 1 for "${query}"`,
      `Search result 2 for "${query}"`,
    ];
  }
}

export class Code implements Tool {
  name = "code";
  description = "A tool to run JavaScript/TypeScript code in a secure sandbox.";

  async execute(args: { code: string }, context: Context): Promise<string> {
    const code = args.code || "";
    try {
      // In real app, run in secure worker/vm. Here we mock execute.
      return `[Code Output] Executed: ${code}. Result: success`;
    } catch (err: any) {
      return `[Code Error] ${err.message}`;
    }
  }
}

export class CustomTools implements Tool {
  name = "custom";
  description = "A tool that wraps user-defined functional callbacks.";

  private callback: (args: any, context: Context) => Promise<any>;

  constructor(name: string, description: string, callback: (args: any, context: Context) => Promise<any>) {
    this.name = name;
    this.description = description;
    this.callback = callback;
  }

  async execute(args: any, context: Context): Promise<any> {
    return await this.callback(args, context);
  }
}
