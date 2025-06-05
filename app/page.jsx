import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ArrowRight, ArrowRightCircle, Check, Stethoscope } from "lucide-react";
import Link from "next/link";
import { creditBenefits, features, testimonials } from "@/lib/data";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge
                variant="outline"
                className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium"
              >
                Healthcare at your Fingertips
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight ">
                Connect With <br /> Doctors <br />
                <span className="bg-gradient-to-b from-emerald-500 to-teal-400 font-bold text-transparent bg-clip-text pb-1 pr-5">
                  Anytime, Anywhere
                </span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                Book appointmenst, Consult via vedio calls, and manage your
                healthcare journey all in one secure platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size={"lg"}
                  className="bg-emerald-400 text-white hover:bg-emerald-600 hover:text-black"
                >
                  <Link href={"/onboarding "}>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size={"lg"}
                  className="border-emerald-400/30 hover:bg-muted/80 hover:text-muted-foreground"
                >
                  <Link href={"/doctors "}>Find Doctors</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
              <Image
                src={"/hero1.png"}
                alt="Doctors Consultant"
                fill
                priority
                className=" object-contain h-full md:pt-14 rounded-xl  "
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform makes healthcare accessible with just few clicks{" "}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((features, index) => {
              return (
                <Card
                  key={index}
                  className="bg-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 "
                >
                  <CardHeader className="pb-2">
                    <div className="bg-emerald-700/40 p-3 rounded-lg w-fit mb-4 ">
                      {features.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-white">
                      {features.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {features.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-900/30 border-emerald-700/30 px-4 py-4 mb-6 text-emerald-400 text-sm font-medium">
              Affordable Healthcare
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-b from-emerald-500 to-teal-400 font-bold text-transparent bg-clip-text pb-1 pr-5">
                Consultation Credits
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the perfect consultation plan that fits your healthcare
              needs
            </p>
          </div>
          <div>
            {/* Pricing Table */}

            <Card className="mt-12 bg-muted/20 border-emerald-900/90">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center">
                  <Stethoscope className="mr-2 h-5 w-5 text-emerald-400" />
                  How our credits system works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {creditBenefits.map((benefit, index) => {
                    return (
                      <li key={index} className="flex items-start">
                        <div className="mr-3 mt-1 bg-emerald-900/20 p-1 rounded-full">
                          <Check className="h-5 w-5 text-emerald-400" />
                        </div>
                        <p
                          className="text-muted-foreground "
                          dangerouslySetInnerHTML={{ __html: benefit }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant={"outline"}
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-4 mb-6 text-emerald-400 text-sm font-medium"
            >
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What our users say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear what our users have to say about our platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              return (
                <Card
                  key={index}
                  className="bg-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 "
                >
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-900/90 flex items-center justify-center mr-4">
                        <span className="text-emerald-400 text-bold">{testimonial.initials}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <br/>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <br/>
                    </div>
                    <p className="text-muted-foreground">
                      &quot;{testimonial.quote}&quot;
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
