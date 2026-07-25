import { Runtime } from "@openclaw/core";

export interface Plugin {
  name: string;
  version: string;
  initialize(runtime: Runtime): void | Promise<void>;
}

export class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();

  async register(plugin: Plugin, runtime: Runtime): Promise<void> {
    this.plugins.set(plugin.name, plugin);
    await plugin.initialize(runtime);
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  list(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}
