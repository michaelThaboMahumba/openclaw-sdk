import { Context } from "@openclaw/core";

export class SpeechToText {
  async transcribe(audioBuffer: Buffer, options?: any): Promise<string> {
    // Mock audio transcription logic
    return "This is a mock transcribed text from SpeechToText.";
  }
}

export class TextToSpeech {
  async synthesize(text: string, options?: any): Promise<Buffer> {
    // Mock speech synthesis logic yielding a blank dummy buffer
    return Buffer.from([0, 1, 2, 3, 4]);
  }
}
