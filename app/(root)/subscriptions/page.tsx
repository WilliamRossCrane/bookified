import SubscriptionPricingTable from "@/components/SubscriptionPricingTable";

export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <main className="wrapper container">
      <SubscriptionPricingTable />
    </main>
  );
};

export default Page;
