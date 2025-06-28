import Pricing from "@/components/pricing";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const PricingPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-start mb-2 ">
        <Link
          href="/"
          className="flex items-center text-muted-foreground hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
      <div className="max-w-full mx-auto mb-12 text-center">
        <Badge className="bg-emerald-900/30 border-emerald-700/30 px-4 py-4 mb-6 text-emerald-400 text-sm font-medium">
          Affordable Healthcare
        </Badge>

        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-emerald-500 to-teal-400 text-transparent bg-clip-text mb-4 ">
          Simple, Transparent Pricing
        </h1>

        <p className="text-lg  text-muted-foreground max-w-2xl mx-auto">
          choose the perfect consultation package that fits your healthcare
          needs with no hidden fees or long-term commitments
        </p>
      </div>

      <Pricing />

      <div className="max-w-3xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Questions? We're here to help
        </h2>
        <p className="text-muted-foreground mb-4 gap-2">
          Contact our support team at
          <a
            className="text-emerald-400 hover:text-white transition-colors duration-300"
            href="mailto:rohanparbatani37@gmail.com@gmail.com"
          >
            support-medinexus@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
