import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Landmark, MapPin, Search, Shield } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { StatsCards } from '@/components/StatsCards';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getOverallStats } from '@/lib/csvParser';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SEO } from '@/components/SEO';

type Suggestion = {
  label: string;
  href: string;
  type: 'bank' | 'tool';
};

type Tool = {
  title: string;
  description: string;
  href: string;
  icon: typeof Search;
};

type ProductCategory = {
  title: string;
  description: string;
  href: string;
};

const POPULAR_BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Canara Bank'];

const TOOLS: Tool[] = [
  { title: 'IFSC Code Finder', description: 'Find IFSC by bank, state, city and branch.', href: '/banks', icon: Search },
  { title: 'MICR Code Finder', description: 'Search MICR code for cheque related needs.', href: '/micr-code-finder', icon: Landmark },
  { title: 'Bank Branch Locator', description: 'Locate branches city-wise with easy navigation.', href: '/banks', icon: MapPin },
  { title: 'NEFT IFSC Search', description: 'Get branch IFSC details for NEFT transfers.', href: '/neft-ifsc-search', icon: Building2 },
  { title: 'RTGS IFSC Search', description: 'Verify IFSC before RTGS transactions.', href: '/rtgs-ifsc-search', icon: Building2 },
  { title: 'IMPS IFSC Search', description: 'Find valid IFSC quickly for IMPS payments.', href: '/imps-ifsc-search', icon: Building2 },
];

const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    title: 'Credit Cards',
    description: 'Best cashback, rewards, and travel card categories.',
    href: '/credit-cards',
  },
  {
    title: 'Bank Accounts',
    description: 'Savings and salary account category pages by banks.',
    href: '/bank-accounts',
  },
  {
    title: 'Demat Accounts',
    description: 'Top demat and trading account category options.',
    href: '/demat-accounts',
  },
  {
    title: 'Personal Loans',
    description: 'Compare personal loan category pages with basics.',
    href: '/personal-loans',
  },
  {
    title: 'Health Insurance',
    description: 'Explore mediclaim and health policy categories.',
    href: '/health-insurance',
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { data, indices, loading, error } = useIFSCData();
  const [query, setQuery] = useState('');

  const stats = useMemo(() => getOverallStats(data), [data]);

  const suggestions = useMemo<Suggestion[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const banks = (indices?.banks ?? POPULAR_BANKS)
      .filter((bank) => bank.toLowerCase().includes(q))
      .slice(0, 5)
      .map((bank) => ({
        label: bank,
        href: `/bank/${encodeURIComponent(bank)}`,
        type: 'bank' as const,
      }));

    const tools = TOOLS
      .filter((tool) => tool.title.toLowerCase().includes(q))
      .slice(0, 3)
      .map((tool) => ({
        label: tool.title,
        href: tool.href,
        type: 'tool' as const,
      }));

    return [...banks, ...tools].slice(0, 8);
  }, [indices, query]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title="Bank IFSC Code Search & Financial Tools | bankifsccode"
        description="Search IFSC and MICR codes, browse branch details, and use practical banking tools on bankifsccode with a fast, mobile-friendly experience."
        path="/"
      />

      <Header />

      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100/70">
          <div className="container mx-auto px-4 py-10 sm:py-16">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 border-0 bg-primary text-primary-foreground">Best IFSC Code Finder</Badge>
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">Find IFSC Code Fast & Correct Every Time</h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
                Search IFSC code, branch details, and MICR in one simple page. Fast, mobile-friendly, and easy to use.
              </p>

              <div className="mx-auto mt-8 max-w-3xl">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search IFSC Code, Bank Branch, City..."
                    className="h-14 rounded-xl border-slate-200 bg-white pl-12 text-base shadow-sm"
                  />

                  {suggestions.length > 0 && (
                    <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-xl">
                      {suggestions.map((item) => (
                        <button
                          key={`${item.type}-${item.label}`}
                          onClick={() => navigate(item.href)}
                          className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 hover:bg-slate-50"
                        >
                          <span>{item.label}</span>
                          <Badge variant="outline" className="capitalize">{item.type}</Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button asChild className="rounded-full">
                  <Link to="/banks">Open IFSC Finder</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/tools">Explore Financial Tools</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 sm:py-10">
          {loading ? <Loader text="Loading IFSC data..." /> : <StatsCards stats={stats} variant="gradient" />}
          {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        </section>

        <section id="ifsc-tools" className="container mx-auto px-4 pb-10">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-semibold sm:text-2xl">Banking Tools</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
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

        <section id="financial-products" className="container mx-auto px-4 pb-16">
          <div className="mb-4">
            <h2 className="text-xl font-semibold sm:text-2xl">Financial Product Categories</h2>
            <p className="mt-1 text-sm text-slate-600">Home page par sirf categories dikhayi gayi hain for clean look.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_CATEGORIES.map((category) => (
              <Card key={category.title} className="rounded-2xl border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                  <h3 className="mt-1 font-semibold">{category.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{category.description}</p>
                  <Button asChild variant="outline" className="mt-4 w-full rounded-full">
                    <Link to={category.href}>View Category</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
