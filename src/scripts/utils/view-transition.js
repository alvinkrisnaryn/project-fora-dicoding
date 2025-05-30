export async function withViewTransition(callback) {
  if (!document.startViewTransition) {
    // Browser tidak mendukung
    await callback();
    return;
  }

  // Jalankan transisi halus
  document.startViewTransition(() => {
    callback();
  });
}
