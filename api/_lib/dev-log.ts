export function devLog(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(message);
  }
}
