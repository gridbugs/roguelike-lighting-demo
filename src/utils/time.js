export async function msDelay(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
