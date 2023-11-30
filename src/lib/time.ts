// Function that takes in a number and returns a promise that resolves after the
// given ms
export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
