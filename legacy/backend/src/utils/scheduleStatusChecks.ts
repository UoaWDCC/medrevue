export function scheduleStatusChecks(orderId: string): void {
  const baseUrl =
    process.env.API_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

  const checkStatus = async () => {
    try {
      await fetch(`${baseUrl}/api/v1/orders/order-status/${orderId}`);
    } catch (err) {
      console.error(`Status check failed for order ${orderId}:`, err);
    }
  };

  let checks = 0;
  const maxChecks = 5;
  const interval = setInterval(
    async () => {
      checks += 1;
      console.log(
        `Checking status for order ${orderId} (${checks}/${maxChecks})`,
      );
      await checkStatus();
      if (checks >= maxChecks) {
        clearInterval(interval);
      }
    },
    10 * 60 * 1000,
  );
}
