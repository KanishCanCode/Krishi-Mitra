import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Smartphone, Wallet, FileCheck, Clock, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Help = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Help Center</h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about using our blockchain-based micro loan system
            </p>
          </div>

          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Secure & Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All transactions are secured on the blockchain, ensuring complete transparency and immutability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Fast Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Smart contracts automate approvals, reducing processing time from days to minutes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Direct Lending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect directly with lenders without intermediaries, reducing costs and complexity.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is blockchain-based micro loan system?</AccordionTrigger>
                  <AccordionContent>
                    Our system uses blockchain technology to provide transparent, secure micro loans to farmers. 
                    It eliminates intermediaries, reduces costs, and ensures all transactions are recorded on an 
                    immutable ledger. Smart contracts automate loan approvals and disbursements.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I apply for a loan?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Loans page, fill in the loan application form with the amount, tenure, and 
                    purpose. You can optionally upload collateral documents. Once submitted, the application is 
                    deployed to the blockchain for review. You'll receive a notification when approved.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What are the requirements?</AccordionTrigger>
                  <AccordionContent>
                    You need: (1) A smartphone with internet connectivity, (2) A compatible digital wallet 
                    (we'll help you set this up), (3) Completed KYC verification, (4) Basic information about 
                    your farming activities. No collateral is mandatory for small loans.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How long does approval take?</AccordionTrigger>
                  <AccordionContent>
                    Smart contracts process applications automatically. Most applications are reviewed within 
                    1 hour. You'll receive a notification about the approval status. Once approved, funds are 
                    disbursed directly to your digital wallet within minutes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>What is KYC and why is it required?</AccordionTrigger>
                  <AccordionContent>
                    KYC (Know Your Customer) is a verification process to confirm your identity. It's required 
                    to ensure system security and prevent fraud. You'll need to provide basic identity documents 
                    like Aadhaar card, PAN card, or voter ID. This is a one-time process.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>How does repayment work?</AccordionTrigger>
                  <AccordionContent>
                    Repayment schedules are flexible and aligned with crop cycles. You can make payments directly 
                    from your digital wallet. The system sends automated reminders before due dates. You can view 
                    your repayment history and schedule in the Dashboard.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes. All data is encrypted and stored on the blockchain, which is immutable and secure. 
                    You need wallet authentication or password to access your account. Only you can view your 
                    personal records. The blockchain's distributed nature ensures high reliability.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>What if I have technical issues?</AccordionTrigger>
                  <AccordionContent>
                    Contact our support team through the contact form or helpline. We provide 24/7 support for 
                    urgent issues. Common issues and solutions are documented in our knowledge base. You can 
                    also visit our regional offices for in-person assistance.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* System Features */}
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>What makes our system unique</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Mobile-First Design</h4>
                  <p className="text-sm text-muted-foreground">
                    Access the system from any smartphone (Android/iOS). No need for a computer. 
                    Manage loans on the go from your farm.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Digital Wallet Integration</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive loan disbursements directly to your digital wallet. Make repayments securely 
                    with blockchain verification.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Detailed Reports</h4>
                  <p className="text-sm text-muted-foreground">
                    Access comprehensive reports on loan history, repayment performance, and portfolio 
                    statistics. Track your credit score improvement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="text-sm font-medium">Email Support</span>
                <span className="text-sm text-primary">support@agriloan.com</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="text-sm font-medium">Phone Support</span>
                <span className="text-sm text-primary">1800-XXX-XXXX (Toll-Free)</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="text-sm font-medium">WhatsApp</span>
                <span className="text-sm text-primary">+91-XXXXX-XXXXX</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
