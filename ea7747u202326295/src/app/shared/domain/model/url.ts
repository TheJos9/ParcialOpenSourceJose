export class Url {
  private readonly url: string;

  constructor(value: string) {
    if (!value) {
      this.url = '';
      return;
    }
    if (!Url.isValid(value)) {
      throw new Error(`Invalid URL: ${value}`);
    }
    this.url = value;
  }

  public static isValid(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  toString(): string {
    return this.url;
  }
}
