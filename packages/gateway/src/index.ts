import { Runtime, Context } from "@openclaw/core";

export interface GatewayConfig {
  port: number;
  host: string;
}

export class Gateway {
  private runtime: Runtime;
  private config: GatewayConfig;
  private isRunning: boolean = false;

  constructor(runtime: Runtime, config: GatewayConfig = { port: 18789, host: "127.0.0.1" }) {
    this.runtime = runtime;
    this.config = config;
  }

  async start(): Promise<void> {
    this.isRunning = true;
    console.log(`[Gateway] Server running at ws://${this.config.host}:${this.config.port}`);
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    console.log(`[Gateway] Server stopped.`);
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }

  // Orchestrate incoming request simulation
  async handleIncomingMessage(agentId: string, message: string, context: Context = new Context()): Promise<string> {
    if (!this.isRunning) {
      throw new Error("Gateway is not running.");
    }
    return await this.runtime.execute(agentId, message, context);
  }
}
