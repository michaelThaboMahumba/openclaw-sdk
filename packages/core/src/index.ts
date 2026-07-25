// Event Definitions
export interface BaseEvent {
  id: string;
  type: string;
  timestamp: number;
  data: any;
}

export type EventCallback = (event: BaseEvent) => void | Promise<void>;

export class Events {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on(type: string, callback: EventCallback): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);
  }

  off(type: string, callback: EventCallback): void {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  async emit(type: string, data: any): Promise<void> {
    const event: BaseEvent = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      timestamp: Date.now(),
      data,
    };

    const callbacks = this.listeners.get(type);
    if (callbacks) {
      const promises = Array.from(callbacks).map((cb) => {
        try {
          return cb(event);
        } catch (err) {
          console.error(`Error in event callback for ${type}:`, err);
        }
      });
      await Promise.all(promises);
    }

    const wildcards = this.listeners.get("*");
    if (wildcards) {
      const promises = Array.from(wildcards).map((cb) => {
        try {
          return cb(event);
        } catch (err) {
          console.error(`Error in wildcard event callback:`, err);
        }
      });
      await Promise.all(promises);
    }
  }
}

// Context Definition
export class Context {
  private variables: Map<string, any> = new Map();

  constructor(initialData: Record<string, any> = {}) {
    for (const [key, value] of Object.entries(initialData)) {
      this.variables.set(key, value);
    }
  }

  get<T>(key: string): T | undefined {
    return this.variables.get(key) as T;
  }

  set(key: string, value: any): void {
    this.variables.set(key, value);
  }

  has(key: string): boolean {
    return this.variables.has(key);
  }

  delete(key: string): boolean {
    return this.variables.delete(key);
  }

  getAll(): Record<string, any> {
    const obj: Record<string, any> = {};
    for (const [key, value] of this.variables.entries()) {
      obj[key] = value;
    }
    return obj;
  }
}

// Tool Contract
export interface Tool {
  name: string;
  description: string;
  execute(args: any, context: Context): Promise<any>;
}

// Memory Contract
export interface Memory {
  save(key: string, value: any): Promise<void>;
  retrieve(key: string): Promise<any>;
  clear(): Promise<void>;
}

// LLM Model Contract
export interface Model {
  generate(prompt: string, options?: any): Promise<string>;
}

// Agent Definition
export interface AgentOptions {
  id: string;
  name: string;
  model: Model;
  memory?: Memory;
  tools?: Tool[];
  systemPrompt?: string;
}

export class Agent {
  readonly id: string;
  readonly name: string;
  private model: Model;
  private memory?: Memory;
  private tools: Map<string, Tool> = new Map();
  private systemPrompt: string;

  constructor(options: AgentOptions) {
    this.id = options.id;
    this.name = options.name;
    this.model = options.model;
    this.memory = options.memory;
    this.systemPrompt = options.systemPrompt ?? "You are a helpful assistant.";

    if (options.tools) {
      for (const tool of options.tools) {
        this.tools.set(tool.name, tool);
      }
    }
  }

  getSystemPrompt(): string {
    return this.systemPrompt;
  }

  getTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  async run(input: string, context: Context, events: Events): Promise<string> {
    await events.emit("run.start", { agentId: this.id, input });

    if (this.memory) {
      await this.memory.save(`input_${Date.now()}`, input);
    }

    // A mock runtime loop within the agent to decide if tools are needed or generate final result
    let response = "";
    if (input.includes("use tool")) {
      const toolName = input.split("use tool")[1].trim();
      const tool = this.tools.get(toolName);
      if (tool) {
        await events.emit("tool.start", { toolName });
        const result = await tool.execute({}, context);
        await events.emit("tool.end", { toolName, result });
        response = await this.model.generate(`Tool result is: ${result}. Compile the final answer.`);
      } else {
        response = `Tool ${toolName} not found.`;
      }
    } else {
      response = await this.model.generate(input);
    }

    if (this.memory) {
      await this.memory.save(`output_${Date.now()}`, response);
    }

    await events.emit("run.end", { agentId: this.id, output: response });
    return response;
  }
}

// Runtime Definition
export class Runtime {
  private agents: Map<string, Agent> = new Map();
  private events: Events = new Events();

  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getEvents(): Events {
    return this.events;
  }

  async execute(agentId: string, input: string, context: Context = new Context()): Promise<string> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent with ID ${agentId} is not registered.`);
    }
    return await agent.run(input, context, this.events);
  }
}
