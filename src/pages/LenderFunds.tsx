import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LenderFunds = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Total Funds Lent</h1>
        <p className="text-muted-foreground mb-8">
          View a breakdown of your total disbursed loans.
        </p>
        <div className="p-6 border rounded-lg bg-muted/30">
          <p>You have lent ₹1,20,000 in total to 12 farmers.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LenderFunds;
