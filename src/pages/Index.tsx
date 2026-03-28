import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  Banknote,
  Building2,
  Calculator,
  Building2,
  CreditCard,
  HeartPulse,
  Landmark,
  MapPin,
  PiggyBank,
  Search,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getOverallStats } from '@/lib/csvParser';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SEO } from '@/components/SEO';
import { StatsCards } from '@/components/StatsCards';

type SearchSuggestion = {
  label: string;
  type: 'bank' | 'city' | 'tool' | 'product';
  href: string;
};

type ToolLink = {
  title: string;
  description: string;
  href: string;
  icon: typeof Search;
};

type FinancialProduct = {
  name: string;
  provider: string;
  image: string;
  features: string[];
  cta: string;
  href: string;
};

const makeProductImage = (label: string, from = '#0f172a', to = '#1d4ed8') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${from}' />
          <stop offset='100%' stop-color='${to}' />
        </linearGradient>
      </defs>
      <rect width='320' height='180' rx='16' fill='url(#g)' />
      <text x='24' y='88' fill='white' font-size='24' font-family='Arial,sans-serif' font-weight='700'>${label}</text>
      <text x='24' y='118' fill='white' font-size='14' font-family='Arial,sans-serif' opacity='0.9'>bankifsccode.biz</text>
    </svg>`
  )}`;

const PRIMARY_IFSC_TOOLS: ToolLink[] = [
  {
    title: 'IFSC Code Finder',
    description: 'Find verified IFSC codes for any bank branch in seconds.',
    href: '/ifsc-code-finder',
  type: 'bank' | 'city' | 'ifsc-tool' | 'product';
  href: string;
};

type FinancialProduct = {
  title: string;
  provider: string;
  feature: string;
  cta: string;
  icon: typeof CreditCard;
};

const IFSC_TOOLS = [
  {
    title: 'IFSC Code Finder',
    description: 'Find verified IFSC codes for any bank branch in seconds.',
    href: '/banks',
    icon: Search,
  },
  {
    title: 'MICR Code Finder',
    description: 'Search MICR details branch-wise with instant filters.',
    description: 'Search branch MICR details instantly with clean filters.',
    href: '/micr-code-finder',
    icon: Landmark,
  },
  {
    title: 'Bank Branch Locator',
    description: 'Locate branches by city, district, state, or IFSC.',
    href: '/bank-branch-locator',
    icon: MapPin,
  },
];

const TOOL_CATEGORIES: { category: string; tools: ToolLink[] }[] = [
  {
    category: 'IFSC & Branch Tools',
    tools: [
      ...PRIMARY_IFSC_TOOLS,
      {
        title: 'Bank Wise IFSC Directory',
        description: 'Browse all banks and branch IFSC listings in India.',
        href: '/bank-wise-ifsc-directory',
        icon: Building2,
      },
      {
        title: 'State Wise Branch Search',
        description: 'Find branches and codes state-by-state quickly.',
        href: '/state-wise-branch-search',
        icon: MapPin,
      },
    ],
  },
  {
    category: 'Finance Calculators',
    tools: [
      {
        title: 'EMI Calculator',
        description: 'Estimate EMI before applying for a loan.',
        href: '/emi-calculator',
        icon: Calculator,
      },
      {
        title: 'SIP Calculator',
        description: 'Project SIP investment growth over time.',
        href: '/sip-calculator',
        icon: TrendingUp,
      },
      {
        title: 'FD Calculator',
        description: 'Calculate fixed deposit maturity amount.',
        href: '/fd-calculator',
        icon: PiggyBank,
      },
      {
        title: 'RD Calculator',
        description: 'Calculate recurring deposit maturity.',
        href: '/rd-calculator',
        icon: Banknote,
      },
    ],
  },
  {
    category: 'Banking Utilities',
    tools: [
      {
        title: 'NEFT IFSC Search',
        description: 'Find IFSC used for NEFT transfers.',
        href: '/neft-ifsc-search',
        icon: BadgeCheck,
      },
      {
        title: 'RTGS IFSC Search',
        description: 'Verify IFSC for RTGS bank transfers.',
        href: '/rtgs-ifsc-search',
        icon: BadgeCheck,
      },
      {
        title: 'IMPS IFSC Search',
        description: 'Find branches and IFSC for instant IMPS.',
        href: '/imps-ifsc-search',
        icon: BadgeCheck,
      },
    ],
  },
];

const FINANCIAL_PRODUCT_CATEGORIES: {
  category: string;
  icon: typeof CreditCard;
  products: FinancialProduct[];
}[] = [
  {
    category: 'Credit Cards',
    icon: CreditCard,
    products: [
      {
        name: 'HDFC Millennia Credit Card',
        provider: 'HDFC Bank',
        image: makeProductImage('HDFC Millennia', '#1e3a8a', '#0f172a'),
        features: ['Cashback benefits', 'Low annual fee'],
        cta: 'Apply Now',
        href: '/credit-cards/hdfc-millennia-credit-card',
      },
      {
        name: 'SBI Cashback Credit Card',
        provider: 'SBI Card',
        image: makeProductImage('SBI Cashback', '#2563eb', '#1e40af'),
        features: ['Online cashback', 'Simple rewards'],
        cta: 'Apply Now',
        href: '/credit-cards/sbi-cashback-credit-card',
      },
    ],
  },
  {
    category: 'Bank Accounts',
    icon: PiggyBank,
    products: [
      {
        name: 'SBI Zero Balance Savings Account',
        provider: 'State Bank of India',
        image: makeProductImage('SBI Savings', '#0369a1', '#0f172a'),
        features: ['No minimum balance', 'Pan-India branch support'],
        cta: 'Open Account',
        href: '/bank-accounts/sbi-zero-balance-savings-account',
      },
      {
        name: 'Kotak 811 Account',
        provider: 'Kotak Mahindra Bank',
        image: makeProductImage('Kotak 811', '#dc2626', '#1e293b'),
        features: ['Digital onboarding', 'Zero balance variant'],
        cta: 'Open Account',
        href: '/bank-accounts/kotak-811-account',
      },
    ],
  },
  {
    category: 'Demat Accounts',
    icon: TrendingUp,
    products: [
      {
        name: 'Zerodha Account',
        provider: 'Zerodha',
        image: makeProductImage('Zerodha', '#9333ea', '#1e1b4b'),
        features: ['Low brokerage', 'Fast online KYC'],
        cta: 'Open Demat',
        href: '/demat-accounts/zerodha-account',
      },
      {
        name: 'Upstox Demat Account',
        provider: 'Upstox',
        image: makeProductImage('Upstox', '#7c3aed', '#1f2937'),
        features: ['Discount brokerage', 'Easy app trading'],
        cta: 'Open Demat',
        href: '/demat-accounts/upstox-demat-account',
      },
    ],
  },
  {
    category: 'Personal Loans',
    icon: Building2,
    products: [
      {
        name: 'ICICI Personal Loan',
        provider: 'ICICI Bank',
        image: makeProductImage('ICICI Loan', '#b91c1c', '#7f1d1d'),
        features: ['Quick approval', 'Flexible repayment'],
        cta: 'Check Offer',
        href: '/personal-loans/icici-personal-loan',
      },
      {
        name: 'HDFC Personal Loan',
        provider: 'HDFC Bank',
        image: makeProductImage('HDFC Loan', '#1d4ed8', '#172554'),
        features: ['Online process', 'Fast disbursal'],
        cta: 'Check Offer',
        href: '/personal-loans/hdfc-personal-loan',
      },
    ],
  },
  {
    category: 'Health Insurance',
    icon: HeartPulse,
    products: [
      {
        name: 'HDFC ERGO Health Insurance',
        provider: 'HDFC ERGO',
        image: makeProductImage('HDFC ERGO', '#0f766e', '#134e4a'),
        features: ['Cashless hospitals', 'Family floater options'],
        cta: 'View Plans',
        href: '/health-insurance/hdfc-ergo-health-insurance',
      },
      {
        name: 'Niva Bupa ReAssure',
        provider: 'Niva Bupa',
        image: makeProductImage('Niva Bupa', '#0ea5e9', '#0f172a'),
        features: ['Restoration benefits', 'Wide hospital network'],
        cta: 'View Plans',
        href: '/health-insurance/niva-bupa-reassure',
      },
    ],
  },
];

const ALL_TOOL_LINKS = TOOL_CATEGORIES.flatMap((entry) => entry.tools);
const ALL_PRODUCT_LINKS = FINANCIAL_PRODUCT_CATEGORIES.flatMap((entry) => entry.products);
    description: 'Locate nearby and city-wise branches quickly.',
    href: '/banks',
    icon: MapPin,
  },
];

const FINANCIAL_PRODUCTS: FinancialProduct[] = [
  {
    title: 'Credit Card',
    provider: 'HDFC Millennia Credit Card',
    feature: 'Cashback • Low annual fee',
    cta: 'Apply Now',
    icon: CreditCard,
  },
  {
    title: 'Bank Account',
    provider: 'SBI Zero Balance Savings Account',
    feature: 'No minimum balance',
    cta: 'Open Account',
    icon: PiggyBank,
  },
  {
    title: 'Demat Account',
    provider: 'Zerodha Account',
    feature: 'Low brokerage',
    cta: 'Open Demat',
    icon: TrendingUp,
  },
  {
    title: 'Personal Loan',
    provider: 'ICICI Personal Loan',
    feature: 'Quick approval',
    cta: 'Check Offer',
    icon: Building2,
  },
  {
    title: 'Health Insurance',
    provider: 'HDFC ERGO Health Insurance',
    feature: 'Cashless hospitals',
    cta: 'View Plans',
    icon: HeartPulse,
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { data, indices, loading, error } = useIFSCData();
  const [search, setSearch] = useState('');
  const [showFinancialProducts, setShowFinancialProducts] = useState(false);
  const productSectionRef = useRef<HTMLElement | null>(null);
  const [showProducts, setShowProducts] = useState(false);
  const productsRef = useRef<HTMLElement | null>(null);

  const stats = useMemo(() => getOverallStats(data), [data]);

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    const query = search.trim().toLowerCase();
    if (query.length < 2) return [];

    const bankSuggestions = (indices?.banks ?? [])
      .filter((bank) => bank.toLowerCase().includes(query))
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];

    const bankSuggestions = (indices?.banks ?? [])
      .filter((bank) => bank.toLowerCase().includes(q))
      .slice(0, 4)
      .map((bank) => ({ label: bank, type: 'bank' as const, href: `/bank/${encodeURIComponent(bank)}` }));

    const citySuggestions = Array.from(new Set(data.map((item) => item.City)))
      .filter((city) => city.toLowerCase().includes(query))
      .slice(0, 3)
      .map((city) => ({ label: `${city} branches`, type: 'city' as const, href: '/banks' }));

    const toolSuggestions = ALL_TOOL_LINKS
      .filter((tool) => tool.title.toLowerCase().includes(query))
      .slice(0, 4)
      .map((tool) => ({ label: tool.title, type: 'tool' as const, href: tool.href }));

    const productSuggestions = ALL_PRODUCT_LINKS
      .filter((product) => product.name.toLowerCase().includes(query))
      .slice(0, 4)
      .map((product) => ({ label: product.name, type: 'product' as const, href: product.href }));

    return [...bankSuggestions, ...citySuggestions, ...toolSuggestions, ...productSuggestions].slice(0, 10);
  }, [data, indices, search]);

  useEffect(() => {
    if (!productSectionRef.current || showFinancialProducts) return;
      .filter((city) => city.toLowerCase().includes(q))
      .slice(0, 3)
      .map((city) => ({ label: `${city} branches`, type: 'city' as const, href: '/banks' }));

    const staticSuggestions: SearchSuggestion[] = [
      { label: 'IFSC Code Finder', type: 'ifsc-tool', href: '/banks' },
      { label: 'MICR Code Finder', type: 'ifsc-tool', href: '/micr-code-finder' },
      { label: 'Bank Branch Locator', type: 'ifsc-tool', href: '/banks' },
      { label: 'Financial Products', type: 'product', href: '/#financial-products' },
    ].filter((item) => item.label.toLowerCase().includes(q));

    return [...bankSuggestions, ...citySuggestions, ...staticSuggestions].slice(0, 8);
  }, [data, indices, search]);

  useEffect(() => {
    if (!productsRef.current || showProducts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShowFinancialProducts(true);
          setShowProducts(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' }
    );

    observer.observe(productSectionRef.current);
    return () => observer.disconnect();
  }, [showFinancialProducts]);
    observer.observe(productsRef.current);
    return () => observer.disconnect();
  }, [showProducts]);

  const renderSearchInput = (className?: string) => (
    <div className={className}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search IFSC Code, Bank Branch, City..."
          className="h-14 rounded-xl border-slate-200 bg-white pl-12 text-base shadow-sm"
        />

        {suggestions.length > 0 && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {suggestions.map((item) => (
              <button
                key={`${item.type}-${item.label}`}
                onClick={() => navigate(item.href)}
                className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left text-sm last:border-b-0 hover:bg-slate-50"
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
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title="bankifsccode.biz - IFSC Finder, Bank Tools, Financial Products"
        description="Fast IFSC finder with instant suggestions, category-wise SEO-friendly tools, and category-wise financial products with apply buttons and images."
        title="bankifsccode.biz - Fast IFSC Finder & Financial Products"
        description="Find IFSC codes quickly with instant suggestions, MICR tools, and branch locator. Discover top financial products in a lightweight mobile-first layout."
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
              '@type': 'Organization',
              name: 'bankifsccode.biz',
              url: 'https://www.bankifsccode.biz/',
              sameAs: [
                'https://www.bankifsccode.biz/about',
                'https://www.bankifsccode.biz/contact',
              ],
            },
          ],
        }}
      />
      <Header />

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100/70">
          <div className="container mx-auto px-4 py-10 sm:py-16">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 border-0 bg-slate-900 text-white">Fast IFSC Finder for India</Badge>
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">Instant IFSC search, built for speed.</h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
                Search IFSC codes, branch details, bank tools, and financial products in one lightweight experience.
              </p>
                Search IFSC codes, branch details, and city-wise bank information in one lightweight experience.
              </p>

              <div className="mx-auto mt-8 max-w-3xl">{renderSearchInput()}</div>
            </div>
          </div>
        </section>

        <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur md:hidden">
          <div className="mx-auto max-w-4xl">{renderSearchInput()}</div>
        </div>

        <section className="container mx-auto px-4 py-8 sm:py-10">
          {loading ? <Loader text="Loading IFSC data first..." /> : <StatsCards stats={stats} variant="gradient" />}
          {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        </section>

        <section id="ifsc-tools" className="container mx-auto px-4 pb-10">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-semibold sm:text-2xl">IFSC Tools (Primary)</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {PRIMARY_IFSC_TOOLS.map((tool) => (
              <Link
                key={tool.title}
                to={tool.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <tool.icon className="mb-3 h-5 w-5 text-slate-700" />
                <h3 className="font-semibold">{tool.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <div className="mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-semibold sm:text-2xl">All Tools (Category Wise)</h2>
          </div>
          <p className="mb-5 text-sm text-slate-600">SEO-friendly links grouped by category for easy discovery.</p>

          <div className="space-y-5">
            {TOOL_CATEGORIES.map((category) => (
              <Card key={category.category} className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="mb-4 text-lg font-semibold">{category.category}</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.href}
                        to={tool.href}
                        className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <tool.icon className="mb-2 h-4 w-4 text-slate-700" />
                        <p className="text-sm font-semibold">{tool.title}</p>
                        <p className="mt-1 text-xs text-slate-600">{tool.description}</p>
                        <p className="mt-2 text-xs text-blue-700">{tool.href}</p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="financial-products" ref={productSectionRef} className="container mx-auto px-4 pb-14">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-semibold sm:text-2xl">Financial Products (Category Wise)</h2>
            <Badge variant="secondary" className="ml-1">Secondary</Badge>
          </div>
          <p className="mb-5 text-sm text-slate-600">
            Category-wise products with images, apply buttons, and mandatory action buttons.
          </p>

          {!showFinancialProducts ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {FINANCIAL_PRODUCT_CATEGORIES.map((entry) => (
                <Card key={entry.category} className="rounded-2xl border-slate-200 shadow-sm">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <entry.icon className="h-5 w-5 text-slate-700" />
                      <h3 className="text-lg font-semibold">{entry.category}</h3>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {entry.products.map((product) => (
                        <Card key={product.name} className="min-w-[280px] rounded-2xl border-slate-200 shadow-sm">
                          <CardContent className="p-4">
                            <img
                              src={product.image}
                              alt={`${product.name} preview`}
                              className="mb-3 h-20 w-full rounded-md border border-slate-200 bg-white object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{product.provider}</p>
                            <h4 className="mt-1 text-sm font-semibold">{product.name}</h4>
                            <ul className="mt-2 space-y-1 text-sm text-slate-600">
                              {product.features.map((feature) => (
                                <li key={feature}>• {feature}</li>
                              ))}
                            </ul>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                              <Button asChild className="h-9 bg-slate-900 text-white hover:bg-slate-800">
                                <Link to={product.href}>{product.cta}</Link>
                              </Button>
                              <Button asChild variant="outline" className="h-9">
                                <Link to={product.href}>View Details</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
        </section>

        <section id="ifsc-tools" className="container mx-auto px-4 pb-10">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-semibold sm:text-2xl">IFSC Tools</h2>
          </div>
          <p className="mb-5 text-sm text-slate-600">Primary tools for fast branch and code lookup.</p>

          <div className="grid gap-4 md:grid-cols-3">
            {IFSC_TOOLS.map((tool) => (
              <Link
                key={tool.title}
                to={tool.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <tool.icon className="mb-3 h-5 w-5 text-slate-700" />
                <h3 className="font-semibold">{tool.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="financial-products" ref={productsRef} className="container mx-auto px-4 pb-14">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-semibold sm:text-2xl">Financial Products</h2>
            <Badge variant="secondary" className="ml-1">Secondary</Badge>
          </div>
          <p className="mb-5 text-sm text-slate-600">
            Curated products for monetization without clutter. Shown only after core IFSC content loads.
          </p>

          {!showProducts ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              ))}
            </div>
          ) : (
            <div className="flex snap-x gap-4 overflow-x-auto pb-2">
              {FINANCIAL_PRODUCTS.map((product) => (
                <Card
                  key={product.provider}
                  className="min-w-[250px] snap-start rounded-2xl border-slate-200 shadow-sm"
                >
                  <CardContent className="p-4">
                    <product.icon className="mb-3 h-5 w-5 text-slate-700" />
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{product.title}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold">{product.provider}</h3>
                    <p className="mt-2 text-sm text-slate-600">{product.feature}</p>
                    <Button className="mt-4 h-9 w-full rounded-lg bg-slate-900 text-white hover:bg-slate-800">
                      {product.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="container mx-auto px-4 pb-16">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="grid gap-6 p-6 md:grid-cols-3">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Why this helps AdSense approval</h3>
                <p className="text-sm text-slate-600">
                  We now prioritize helpful IFSC utility content, clear navigation, and original product descriptions
                  with user-first actions.
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Trust & policy pages</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• About us and contact details</li>
                  <li>• Privacy, terms, and disclaimer</li>
                  <li>• Transparent product CTA labels</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Performance upgrades</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Inlined lightweight SVG product images</li>
                  <li>• Lazy-load financial section and images</li>
                  <li>• Reduced external image network calls</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
