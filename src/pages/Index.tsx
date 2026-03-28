import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CreditCard,
  HeartPulse,
  Landmark,
  MapPin,
  PiggyBank,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SEO } from '@/components/SEO';

type ToolItem = {
  title: string;
  description: string;
  href: string;
  icon: typeof Search;
};

type ProductItem = {
  name: string;
  provider: string;
  description: string;
  highlights: string[];
  cta: string;
  href: string;
  icon: typeof CreditCard;
};

type Suggestion = { label: string; href: string; type: 'tool' | 'product' | 'bank' };

const POPULAR_BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
  'Canara Bank',
];

const TOOL_CATEGORIES: { category: string; tools: ToolItem[] }[] = [
  {
    category: 'IFSC Essentials',
    tools: [
      { title: 'IFSC Code Finder', description: 'Find IFSC by bank and branch.', href: '/ifsc-code-finder', icon: Search },
      { title: 'MICR Code Finder', description: 'Search branch MICR instantly.', href: '/micr-code-finder', icon: Landmark },
      { title: 'Bank Branch Locator', description: 'Locate branches city/state wise.', href: '/bank-branch-locator', icon: MapPin },
      { title: 'NEFT IFSC Search', description: 'Find IFSC for NEFT transfers.', href: '/neft-ifsc-search', icon: Building2 },
      { title: 'RTGS IFSC Search', description: 'Check IFSC for RTGS transfers.', href: '/rtgs-ifsc-search', icon: Building2 },
      { title: 'IMPS IFSC Search', description: 'Find IFSC for IMPS payments.', href: '/imps-ifsc-search', icon: Building2 },
    ],
  },
  {
    category: 'Financial Calculators',
    tools: [
      { title: 'EMI Calculator', description: 'Plan monthly loan payments.', href: '/emi-calculator', icon: TrendingUp },
      { title: 'SIP Calculator', description: 'Estimate mutual fund growth.', href: '/sip-calculator', icon: TrendingUp },
      { title: 'FD Calculator', description: 'Check FD maturity estimate.', href: '/fd-calculator', icon: PiggyBank },
      { title: 'RD Calculator', description: 'Calculate RD maturity value.', href: '/rd-calculator', icon: PiggyBank },
    ],
  },
];

const PRODUCT_CATEGORIES: { category: string; products: ProductItem[] }[] = [
  {
    category: 'Credit Cards',
    products: [
      {
        name: 'HDFC Millennia Credit Card',
        provider: 'HDFC Bank',
        description: 'Premium cashback card for online shopping and lifestyle spends.',
        highlights: ['Cashback on online spends', 'Low annual fee', 'Welcome benefits'],
        cta: 'Apply Now',
        href: '/credit-cards/hdfc-millennia-credit-card',
        icon: CreditCard,
      },
      {
        name: 'SBI Cashback Credit Card',
        provider: 'SBI Card',
        description: 'Simple cashback card with strong digital purchase rewards.',
        highlights: ['Flat cashback model', 'Online friendly rewards', 'Easy redemption'],
        cta: 'Apply Now',
        href: '/credit-cards/sbi-cashback-credit-card',
        icon: CreditCard,
      },
    ],
  },
  {
    category: 'Bank Accounts',
    products: [
      {
        name: 'SBI Zero Balance Savings Account',
        provider: 'State Bank of India',
        description: 'Trusted savings account option with no minimum balance variant.',
        highlights: ['No minimum balance', 'Wide branch network', 'Digital banking support'],
        cta: 'Open Account',
        href: '/bank-accounts/sbi-zero-balance-savings-account',
        icon: PiggyBank,
      },
      {
        name: 'Kotak 811 Account',
        provider: 'Kotak Mahindra Bank',
        description: 'Digital account opening with a premium app-led experience.',
        highlights: ['Online onboarding', 'Zero-balance option', 'Modern mobile app'],
        cta: 'Open Account',
        href: '/bank-accounts/kotak-811-account',
        icon: PiggyBank,
      },
    ],
  },
  {
    category: 'Investments, Loans & Insurance',
    products: [
      {
        name: 'Zerodha Account',
        provider: 'Zerodha',
        description: 'Demat + trading account with low-cost brokerage model.',
        highlights: ['Low brokerage', 'Fast account opening', 'Strong trading tools'],
        cta: 'Open Demat',
        href: '/demat-accounts/zerodha-account',
        icon: TrendingUp,
      },
      {
        name: 'ICICI Personal Loan',
        provider: 'ICICI Bank',
        description: 'Personal loan product with quick approval journey.',
        highlights: ['Fast approval flow', 'Flexible repayment', 'Online process'],
        cta: 'Check Offer',
        href: '/personal-loans/icici-personal-loan',
        icon: Building2,
      },
      {
        name: 'HDFC ERGO Health Insurance',
        provider: 'HDFC ERGO',
        description: 'Comprehensive health plans with large cashless hospital network.',
        highlights: ['Cashless hospitals', 'Family options', 'Tax benefits eligibility'],
        cta: 'View Plans',
        href: '/health-insurance/hdfc-ergo-health-insurance',
        icon: HeartPulse,
      },
    ],
  },
];

const ALL_TOOLS = TOOL_CATEGORIES.flatMap((section) => section.tools);
const ALL_PRODUCTS = PRODUCT_CATEGORIES.flatMap((section) => section.products);

export default function Index() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const suggestions = useMemo<Suggestion[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const bankMatches = POPULAR_BANKS.filter((bank) => bank.toLowerCase().includes(q))
      .slice(0, 4)
      .map((bank) => ({ label: bank, href: `/bank/${encodeURIComponent(bank)}`, type: 'bank' as const }));

    const toolMatches = ALL_TOOLS.filter((tool) => tool.title.toLowerCase().includes(q))
      .slice(0, 5)
      .map((tool) => ({ label: tool.title, href: tool.href, type: 'tool' as const }));

    const productMatches = ALL_PRODUCTS.filter((product) => product.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((product) => ({ label: product.name, href: product.href, type: 'product' as const }));

    return [...bankMatches, ...toolMatches, ...productMatches].slice(0, 10);
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title="bankifsccode.biz - Fast IFSC Finder, All Tools, Premium Financial Products"
        description="Find IFSC fast, browse all tool categories, and compare premium financial products with clear descriptions and action buttons."
        path="/"
        schema={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              name: 'bankifsccode.biz',
              url: 'https://www.bankifsccode.biz/',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.bankifsccode.biz/branch/{search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@type': 'ItemList',
              name: 'IFSC Tools Categories',
              itemListElement: TOOL_CATEGORIES.map((section, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: section.category,
              })),
            },
          ],
        }}
      />

      <Header />

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4 py-10 sm:py-14">
            <div className="mx-auto max-w-5xl text-center">
              <Badge className="mb-4 border-0 bg-white/15 text-white">
                <Sparkles className="mr-2 h-4 w-4" /> Premium IFSC Discovery Platform
              </Badge>
              <h1 className="text-3xl font-bold sm:text-5xl">Find IFSC codes instantly. Explore every tool category.</h1>
              <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-200 sm:text-base">
                Fast homepage, better SEO structure, and category-wise tools + product sections with clear CTA buttons.
              </p>

              <div className="mx-auto mt-8 max-w-3xl">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search IFSC Code, Bank Branch, City..."
                    className="h-14 rounded-xl border-0 bg-white pl-12 text-base text-slate-900 shadow-lg"
                  />

                  {suggestions.length > 0 && (
                    <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left text-slate-900 shadow-xl">
                      {suggestions.map((item) => (
                        <button
                          key={`${item.type}-${item.label}`}
                          onClick={() => navigate(item.href)}
                          className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 hover:bg-slate-50"
                        >
                          <span>{item.label}</span>
                          <Badge variant="outline" className="capitalize">
                            {item.type}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ifsc-tools" className="container mx-auto px-4 py-10">
          <div className="mb-6 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-slate-700" />
            <h2 className="text-2xl font-semibold">All Tool Categories</h2>
          </div>

          <div className="space-y-6">
            {TOOL_CATEGORIES.map((section) => (
              <Card key={section.category} className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold">{section.category}</h3>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link to="/tools">View Category</Link>
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {section.tools.map((tool) => (
                      <Card key={tool.href} className="rounded-xl border-slate-200 shadow-none">
                        <CardContent className="p-4">
                          <tool.icon className="mb-2 h-4 w-4 text-slate-700" />
                          <p className="font-semibold">{tool.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{tool.description}</p>
                          <Button asChild size="sm" className="mt-3 rounded-full bg-slate-900 hover:bg-slate-800">
                            <Link to={tool.href}>Open Tool</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="financial-products" className="container mx-auto px-4 pb-16">
          <div className="mb-6 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-slate-700" />
            <h2 className="text-2xl font-semibold">Premium Financial Products</h2>
          </div>

          <div className="space-y-6">
            {PRODUCT_CATEGORIES.map((section) => (
              <Card key={section.category} className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">{section.category}</h3>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {section.products.map((product) => (
                      <Card
                        key={product.name}
                        className="rounded-xl border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <CardContent className="p-5">
                          <div className="mb-3 inline-flex rounded-full bg-slate-100 p-2">
                            <product.icon className="h-4 w-4 text-slate-700" />
                          </div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{product.provider}</p>
                          <h4 className="mt-1 text-base font-semibold">{product.name}</h4>
                          <p className="mt-2 text-sm text-slate-600">{product.description}</p>

                          <ul className="mt-3 space-y-1 text-sm text-slate-700">
                            {product.highlights.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>

                          <div className="mt-4 flex gap-2">
                            <Button asChild className="rounded-full bg-slate-900 hover:bg-slate-800">
                              <Link to={product.href}>{product.cta}</Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-full">
                              <Link to={product.href}>Know More</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Performance & AdSense readiness upgrades done</h3>
              <p className="mt-2 text-sm text-slate-600">
                Homepage is now lightweight and avoids heavy IFSC dataset loading at first paint. This improves FCP/LCP potential,
                keeps navigation clean, and supports policy-first monetization pages.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="outline" className="rounded-full"><Link to="/privacy">Privacy Policy</Link></Button>
                <Button asChild variant="outline" className="rounded-full"><Link to="/terms">Terms</Link></Button>
                <Button asChild variant="outline" className="rounded-full"><Link to="/disclaimer">Disclaimer</Link></Button>
                <Button asChild variant="outline" className="rounded-full"><Link to="/contact">Contact</Link></Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
