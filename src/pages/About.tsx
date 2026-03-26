import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Users, Target, Shield, Award, CheckCircle, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import logo from '@/assets/logo.png';
import aboutbg from "@/assets/about.png"
import { SEO } from '@/components/SEO';

export default function About() {
  const features = [
    {
      icon: Shield,
      title: 'Verified Data',
      description: 'All IFSC codes are verified and sourced directly from RBI database.',
    },
    {
      icon: Target,
      title: 'Accurate Results',
      description: 'Get precise branch information with 100% accuracy guarantee.',
    },
    {
      icon: Award,
      title: 'Comprehensive Coverage',
      description: 'Complete database of all banks and branches across India.',
    },
    {
      icon: Users,
      title: 'User Friendly',
      description: 'Easy-to-use interface designed for quick IFSC code lookup.',
    },
  ];

  const stats = [
    { value: '244+', label: 'Banks Listed' },
    { value: '1,50,000+', label: 'Branch Records' },
    { value: '36+', label: 'States Covered (Including Union Territories)' },
    { value: '10,000+', label: 'Cities Covered' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="About bankifsccode.biz | IFSC Code Search Platform"
        description="Learn about bankifsccode.biz, our mission, data quality standards, and commitment to accurate IFSC code lookup across India."
        path="/about"
      />
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs items={[{ label: 'About Us' }]} />
        </div>

        {/* Hero Section */}
        <section style={{ backgroundImage: `url(${aboutbg})` }} className="relative py-12 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#006898] text-white border border-red-800 shadow-lg text-sm font-medium mb-6 animate-fade-in">
                <Building2 className="h-4 w-4" />
                About IFSC Finder
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in">
                India's Most Trusted{' '}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  IFSC Code Database
                </span>
              </h1>
              <p className="text-lg text-black leading-relaxed animate-fade-in">
                We are dedicated to providing accurate and up-to-date IFSC codes for all banks in India.
                Our mission is to simplify banking by making it easy to find the right codes for
                NEFT, RTGS, and IMPS transactions.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Why Choose IFSC Finder?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide the most comprehensive and reliable IFSC code database in India.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Developer Section */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="border-border/50 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                      <img src={logo} alt="IFSC Code" loading='lazy' className=" rounded-full h-16 w-16 text-primary" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-bold text-foreground mb-2">Pawan Yadav</h3>
                      <p className="text-primary font-medium mb-3">Founder & Developer</p>
                      <p className="text-muted-foreground leading-relaxed">
                        Passionate about making banking information accessible to everyone.
                        Built this platform to help millions of Indians find their bank's IFSC codes quickly and easily.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 text-center">
                Our Commitment
              </h2>
              <div className="space-y-4">
                {[
                  'Providing 100% accurate IFSC codes verified from RBI',
                  'Regular updates to keep the database current',
                  'Free access to all bank information',
                  'Fast and responsive search experience',
                  'Mobile-friendly design for on-the-go access',
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border/50 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
