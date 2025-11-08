import { Shield, Zap, TrendingUp, Users, Clock, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import blockchainIcon from "@/assets/blockchain-icon.png";
import farmerIcon from "@/assets/farmer-icon.png";
import loanIcon from "@/assets/loan-icon.png";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Your data is secured on an immutable blockchain ledger, ensuring transparency and trust.",
    },
    {
      icon: Zap,
      title: "Instant Approval",
      description: "Smart contracts automate loan approvals, reducing wait times from days to minutes.",
    },
    {
      icon: TrendingUp,
      title: "Flexible Repayment",
      description: "Repayment schedules aligned with your crop cycles for maximum convenience.",
    },
    {
      icon: Users,
      title: "Direct Lending",
      description: "Connect directly with lenders, eliminating intermediaries and reducing costs.",
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Manage your loans anytime, anywhere through our mobile-friendly platform.",
    },
    {
      icon: Lock,
      title: "KYC Verified",
      description: "Secure identity verification ensures a safe ecosystem for all participants.",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Krishi Mitra
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Revolutionizing agricultural financing with cutting-edge blockchain technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
