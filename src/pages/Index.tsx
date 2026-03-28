import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
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
    description: 'Search branch MICR details instantly with clean filters.',
    href: '/micr-code-finder',
    icon: Landmark,
  },
  {
    title: 'Bank Branch Locator',
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
  const [showProducts, setShowProducts] = useState(false);
  const productsRef = useRef<HTMLElement | null>(null);

  const stats = useMemo(() => getOverallStats(data), [data]);

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];

    const bankSuggestions = (indices?.banks ?? [])
      .filter((bank) => bank.toLowerCase().includes(q))
      .slice(0, 4)
      .map((bank) => ({ label: bank, type: 'bank' as const, href: `/bank/${encodeURIComponent(bank)}` }));

    const citySuggestions = Array.from(new Set(data.map((item) => item.City)))
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
          setShowProducts(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' }
    );

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
        title="bankifsccode.biz - Fast IFSC Finder & Financial Products"
        description="Find IFSC codes quickly with instant suggestions, MICR tools, and branch locator. Discover top financial products in a lightweight mobile-first layout."
        path="/"
      />
      <Header />

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100/70">
          <div className="container mx-auto px-4 py-10 sm:py-16">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 border-0 bg-slate-900 text-white">Fast IFSC Finder for India</Badge>
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">Instant IFSC search, built for speed.</h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
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
      </main>

      <Footer />
    </div>
  );
}
