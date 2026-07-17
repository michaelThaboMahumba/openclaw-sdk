import { Memory } from "@openclaw/core";

export class VectorMemory implements Memory {
  private store: Map<string, { value: any; embedding: number[] }> = new Map();

  async save(key: string, value: any): Promise<void> {
    // Simulate generation of embeddings
    const mockEmbedding = Array.from({ length: 1536 }, () => Math.random());
    this.store.set(key, { value, embedding: mockEmbedding });
  }

  async retrieve(key: string): Promise<any> {
    const item = this.store.get(key);
    return item ? item.value : null;
  }

  async similaritySearch(queryEmbedding: number[], k: number = 3): Promise<any[]> {
    // In real app, perform cosine similarity, here just mock return values
    const results = Array.from(this.store.values())
      .slice(0, k)
      .map((item) => item.value);
    return results;
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

export class SQLMemory implements Memory {
  private db: Map<string, any> = new Map();

  async save(key: string, value: any): Promise<void> {
    this.db.set(key, JSON.stringify(value));
  }

  async retrieve(key: string): Promise<any> {
    const raw = this.db.get(key);
    return raw ? JSON.parse(raw) : null;
  }

  async clear(): Promise<void> {
    this.db.clear();
  }
}

export class FileMemory implements Memory {
  private files: Map<string, any> = new Map();

  async save(key: string, value: any): Promise<void> {
    this.files.set(key, value);
  }

  async retrieve(key: string): Promise<any> {
    return this.files.get(key) || null;
  }

  async clear(): Promise<void> {
    this.files.clear();
  }
}
