export class DateTime {
  private readonly date: Date;

  constructor(value?: string | Date) {
    this.date = value ? new Date(value) : new Date();
  }

  toString(): string {
    return this.date.toISOString();
  }
  toLocaleDateString(): string {
    return this.date.toLocaleDateString();
  }

  toLocaleTimeString(): string {
    return this.date.toLocaleTimeString();
  }

  toDate(): Date {
    return this.date;
  }
}
