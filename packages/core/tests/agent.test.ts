import { describe, it, expect } from "vitest";
import { Agent, Runtime, Context, Events } from "../src/index.js";

// Mock Model for Testing
class MockModel {
  async generate(prompt: string): Promise<string> {
    return `mocked: ${prompt}`;
  }
}

describe("Agent and Runtime Tests", () => {
  it("should initialize an agent and runtime", async () => {
    const model = new MockModel();
    const agent = new Agent({
      id: "agent-1",
      name: "Cooper",
      model,
    });

    const runtime = new Runtime();
    runtime.registerAgent(agent);

    const retrievedAgent = runtime.getAgent("agent-1");
    expect(retrievedAgent).toBeDefined();
    expect(retrievedAgent?.name).toBe("Cooper");
  });

  it("should run agent execution loop and emit events", async () => {
    const model = new MockModel();
    const agent = new Agent({
      id: "agent-2",
      name: "Pixel",
      model,
    });

    const runtime = new Runtime();
    runtime.registerAgent(agent);

    const events: string[] = [];
    runtime.getEvents().on("run.start", (e) => {
      events.push(e.type);
    });
    runtime.getEvents().on("run.end", (e) => {
      events.push(e.type);
    });

    const context = new Context();
    const result = await runtime.execute("agent-2", "hello world", context);

    expect(result).toBe("mocked: hello world");
    expect(events).toContain("run.start");
    expect(events).toContain("run.end");
  });
});
