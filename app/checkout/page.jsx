import StorefrontShell from "@/components/layout/StorefrontShell";
import CheckoutView from "@/components/checkout/CheckoutView";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <StorefrontShell>
      <CheckoutView />
    </StorefrontShell>
  );
}
