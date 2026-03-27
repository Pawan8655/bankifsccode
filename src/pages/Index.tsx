import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  Calculator,
  Compass,
  CreditCard,
  GitBranch,
  HeartPulse,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchFilters } from '@/components/SearchFilters';
import { StatsCards } from '@/components/StatsCards';
import { Loader } from '@/components/Loader';
import { FavoritesSection } from '@/components/FavoritesSection';
import { SearchHistorySection } from '@/components/SearchHistorySection';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getOverallStats } from '@/lib/csvParser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SEO } from '@/components/SEO';
import { cn } from '@/lib/utils';

type SearchSuggestion = {
  label: string;
  type: 'bank' | 'city' | 'tool' | 'product';
  value: string;
  href: string;
};

type CompareProduct = {
  name: string;
  annualFee?: string;
  rewards?: string;
  cashback?: string;
  eligibility?: string;
  brokerage?: string;
  openingFee?: string;
  amc?: string;
  best?: boolean;
};

const QUICK_ACTIONS = [
  { label: 'IFSC Code', href: '/banks' },
  { label: 'Bank Branch', href: '/banks' },
  { label: 'Credit Cards', href: '/credit-cards' },
  { label: 'Loans', href: '/loans' },
  { label: 'Insurance', href: '/insurance' },
  { label: 'Demat Accounts', href: '/demat-accounts' },
];

const QUICK_TOOLS = [
  { title: 'IFSC Code Finder', desc: 'Instant branch-level IFSC lookup', icon: Search, href: '/banks' },
  { title: 'MICR Code Finder', desc: 'Locate MICR details quickly', icon: Landmark, href: '/micr-code-finder' },
  { title: 'Bank Branch Locator', desc: 'Find branches by city & state', icon: MapPin, href: '/banks' },
  { title: 'EMI Calculator', desc: 'Calculate monthly loan repayment', icon: Calculator, href: '/emi-calculator' },
  { title: 'FD Calculator', desc: 'Estimate fixed deposit maturity', icon: Wallet, href: '/fd-calculator' },
  { title: 'SIP Calculator', desc: 'Project long-term wealth growth', icon: TrendingUp, href: '/sip-calculator' },
];

const CREDIT_CARDS: CompareProduct[] = [
  { name: 'HDFC Regalia Gold', annualFee: '₹2,500', rewards: '4 pts/₹150', cashback: 'Up to 10%', eligibility: '₹12L+ income', best: true },
  { name: 'SBI Cashback Card', annualFee: '₹999', rewards: '5% online', cashback: 'Up to ₹5,000/mo', eligibility: '₹6L+ income' },
  { name: 'ICICI Amazon Pay', annualFee: 'Lifetime Free', rewards: 'Prime cashback', cashback: '5% on Amazon', eligibility: 'Good credit score' },
  { name: 'Axis ACE', annualFee: '₹499', rewards: 'Utility rewards', cashback: '5% bills', eligibility: '₹4.5L+ income' },
];

const DEMAT_ACCOUNTS: CompareProduct[] = [
  { name: 'Zerodha', brokerage: '₹20/order', openingFee: '₹200', amc: '₹300/yr', best: true },
  { name: 'Upstox', brokerage: '₹20/order', openingFee: '₹0', amc: '₹150-₹300/yr' },
  { name: 'Angel One', brokerage: '₹20/order', openingFee: '₹0', amc: '₹240/yr' },
];

const LOANS = [
  { title: 'Personal Loan', rate: '10.50% - 24%', tenure: '1 to 7 years', emi: '₹2,150 per ₹1L (5 yrs)' },
  { title: 'Home Loan', rate: '8.35% - 10.75%', tenure: '5 to 30 years', emi: '₹775 per ₹1L (20 yrs)' },
  { title: 'Car Loan', rate: '8.80% - 13%', tenure: '1 to 7 years', emi: '₹2,030 per ₹1L (5 yrs)' },
];

const INSURANCE = [
  { title: 'Life Insurance', benefit: 'Financial security for family', premium: 'Starts ~₹500/mo' },
  { title: 'Health Insurance', benefit: 'Cashless hospitalization', premium: 'Starts ~₹700/mo' },
  { title: 'Motor Insurance', benefit: 'Own damage + third-party cover', premium: 'Starts ~₹2,000/yr' },
];

const SEO_GUIDES = [
  'Best Credit Cards in India',
  'How to Find IFSC Code',
  'Top Demat Accounts',
];

export default function Index() {
  const navigate = useNavigate();
  const { data, indices, loading, error } = useIFSCData();
  const [globalSearch, setGlobalSearch] = useState('');
  const [locationHint, setLocationHint] = useState('Enable location to find nearest branches.');

  const stats = useMemo(() => getOverallStats(data), [data]);

  const globalSuggestions = useMemo<SearchSuggestion[]>(() => {
    const q = globalSearch.trim().toLowerCase();
    if (q.length < 2) return [];

    const bankSuggestions = (indices?.banks || [])
      .filter((bank) => bank.toLowerCase().includes(q))
      .slice(0, 4)
      .map((bank) => ({ label: bank, type: 'bank' as const, value: bank, href: `/bank/${encodeURIComponent(bank)}` }));

    const citySuggestions = Array.from(new Set(data.map((d) => d.City)))
      .filter((city) => city.toLowerCase().includes(q))
      .slice(0, 3)
      .map((city) => ({ label: `${city} branches`, type: 'city' as const, value: city, href: '/banks' }));

    const productSuggestions: SearchSuggestion[] = [
      { label: 'Credit Cards', type: 'product', value: 'credit cards', href: '/credit-cards' },
      { label: 'Loans', type: 'product', value: 'loans', href: '/loans' },
      { label: 'Insurance', type: 'product', value: 'insurance', href: '/insurance' },
      { label: 'Demat Accounts', type: 'product', value: 'demat', href: '/demat-accounts' },
      { label: 'EMI Calculator', type: 'tool', value: 'emi calculator', href: '/emi-calculator' },
      { label: 'SIP Calculator', type: 'tool', value: 'sip calculator', href: '/sip-calculator' },
    ].filter((item) => item.value.includes(q));

    return [...bankSuggestions, ...citySuggestions, ...productSuggestions].slice(0, 8);
  }, [globalSearch, indices, data]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationHint('Location unavailable on this browser. Use city/state filters below.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => setLocationHint('Location detected. Showing India-focused nearby branch discovery by city/state.'),
      () => setLocationHint('Unable to detect location. Please select city and state manually.')
    );
  };

  const compareRows = [
    { label: 'Annual Fee', key: 'annualFee' as const },
    { label: 'Rewards', key: 'rewards' as const },
    { label: 'Cashback', key: 'cashback' as const },
    { label: 'Eligibility', key: 'eligibility' as const },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title="bankifsccode.biz - IFSC Finder, Comparisons, Loans, Credit Cards"
        description="Premium Indian financial discovery platform: IFSC lookup, branch locator, smart comparison tools, calculators, and product discovery."
        path="/"
      />
      <Header />

      <main>
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-[#0B3C5D] via-[#1e3a8a] to-[#0f172a] text-white">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_30%_20%,#67e8f9,transparent_35%),radial-gradient(circle_at_80%_0%,#facc15,transparent_30%)]" />
          <div className="container relative mx-auto px-4 pb-10 pt-6 sm:pb-16 sm:pt-10">
            <div className="mx-auto max-w-5xl text-center">
              <Badge className="mb-4 border-0 bg-white/15 text-white hover:bg-white/20">
                <Sparkles className="mr-2 h-4 w-4" /> Trusted by 1M+ users across India
              </Badge>
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">Search. Compare. Choose better financial products.</h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-100 sm:text-lg">
                IFSC codes, branch details, credit cards, loans, insurance and demat comparison — fast, clean and mobile-first.
              </p>

              <div className="mx-auto mt-7 max-w-3xl rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                  <Input
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    placeholder="Search IFSC Code, Bank, Branch, Credit Cards, Loans..."
                    className="h-12 border-white/30 bg-white/95 pl-12 text-slate-900"
                  />
                  {globalSuggestions.length > 0 && (
                    <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border bg-white text-left text-slate-900 shadow-xl">
                      {globalSuggestions.map((item) => (
                        <button
                          key={`${item.type}-${item.label}`}
                          className="flex w-full items-center justify-between border-b px-4 py-3 text-sm last:border-0 hover:bg-slate-50"
                          onClick={() => navigate(item.href)}
                        >
                          <span>{item.label}</span>
                          <Badge variant="outline" className="capitalize">{item.type}</Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {QUICK_ACTIONS.map((item) => (
                    <Link key={item.label} to={item.href}>
                      <Button size="sm" variant="secondary" className="rounded-full bg-white/90 text-slate-900 hover:bg-white">
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 sm:py-10">
          {loading ? <Loader text="Loading live bank data..." /> : <StatsCards stats={stats} variant="gradient" />}
        </section>

        <section className="container mx-auto px-4 pb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_TOOLS.map((tool) => (
              <Link key={tool.title} to={tool.href} className="group rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <tool.icon className="mb-3 h-5 w-5 text-[#0B3C5D]" />
                <h3 className="font-semibold group-hover:text-[#0B3C5D]">{tool.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><CreditCard className="h-5 w-5 text-[#0B3C5D]" /> Credit Cards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {CREDIT_CARDS.map((card) => (
                  <div key={card.name} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{card.name}</p>
                      {card.best && <Badge className="bg-emerald-100 text-emerald-700">Best Value</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Fee: {card.annualFee} • Rewards: {card.rewards} • Cashback: {card.cashback}</p>
                  </div>
                ))}
                <Button className="w-full bg-[#0B3C5D] hover:bg-[#0B3C5D]/90">Compare Now</Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><TrendingUp className="h-5 w-5 text-teal-700" /> Demat Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {DEMAT_ACCOUNTS.map((account) => (
                  <div key={account.name} className={cn('rounded-xl border p-3', account.best && 'border-emerald-300 bg-emerald-50/60')}>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{account.name}</p>
                      {account.best && <BadgeCheck className="h-4 w-4 text-emerald-600" />}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">Brokerage: {account.brokerage} • Opening: {account.openingFee} • AMC: {account.amc}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Check Details</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Landmark className="h-5 w-5 text-[#0B3C5D]" /> Loans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {LOANS.map((loan) => (
                  <div key={loan.title} className="rounded-xl border p-3">
                    <p className="font-medium">{loan.title}</p>
                    <p className="mt-2 text-sm text-slate-600">Interest: {loan.rate} • Tenure: {loan.tenure} • EMI: {loan.emi}</p>
                  </div>
                ))}
                <Button className="w-full bg-teal-700 hover:bg-teal-700/90">Apply Now</Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><HeartPulse className="h-5 w-5 text-rose-600" /> Insurance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {INSURANCE.map((item) => (
                  <div key={item.title} className="rounded-xl border p-3">
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.benefit}</p>
                    <p className="text-sm font-medium text-slate-700">Premium: {item.premium}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Compare Plans</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-8">
          <Card className="overflow-hidden border-0 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><GitBranch className="h-5 w-5 text-[#0B3C5D]" /> Side-by-side credit card comparison</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-3 py-3 font-semibold">Feature</th>
                    {CREDIT_CARDS.map((card) => (
                      <th key={card.name} className={cn('px-3 py-3 font-semibold', card.best && 'bg-emerald-50')}>
                        {card.name} {card.best && <Badge className="ml-2 bg-emerald-100 text-emerald-700">Best</Badge>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.key} className="border-b align-top">
                      <td className="px-3 py-3 font-medium">{row.label}</td>
                      {CREDIT_CARDS.map((card) => (
                        <td key={`${card.name}-${row.key}`} className={cn('px-3 py-3 text-slate-700', card.best && 'bg-emerald-50/50')}>
                          {card[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 pb-8">
          <Card className="border-0 bg-gradient-to-r from-[#0B3C5D] to-[#1e3a8a] text-white shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold"><Compass className="h-5 w-5" /> Location-based branch discovery</h2>
                <Button variant="secondary" onClick={detectLocation}>Use My Location</Button>
              </div>
              <p className="text-sm text-slate-100">{locationHint}</p>
              <div className="mt-5 rounded-2xl border border-white/20 bg-white/95 p-4 text-slate-900">
                {loading ? (
                  <Loader text="Preparing branch filters..." />
                ) : error ? (
                  <p className="text-sm text-rose-600">{error}</p>
                ) : (
                  <SearchFilters data={data} indices={indices} />
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <FavoritesSection />
        <SearchHistorySection />

        <section className="container mx-auto px-4 py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {SEO_GUIDES.map((guide) => (
              <Link key={guide} to="/blogs" className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
                <BookOpen className="mb-3 h-5 w-5 text-[#0B3C5D]" />
                <h3 className="font-semibold">{guide}</h3>
                <p className="mt-2 text-sm text-slate-600">Practical, India-focused guides for better financial decisions.</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-[#0B3C5D]">Read Guide <ArrowRight className="ml-1 h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-24 md:pb-10">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 bg-white shadow-sm"><CardContent className="p-5"><ShieldCheck className="mb-2 h-5 w-5 text-emerald-600" /><p className="font-semibold">Secure & trusted</p><p className="text-sm text-slate-600">Privacy-first platform trusted by Indian users.</p></CardContent></Card>
            <Card className="border-0 bg-white shadow-sm"><CardContent className="p-5"><BadgeCheck className="mb-2 h-5 w-5 text-amber-600" /><p className="font-semibold">Transparent rankings</p><p className="text-sm text-slate-600">Sponsored listings marked clearly for trust.</p></CardContent></Card>
            <Card className="border-0 bg-white shadow-sm"><CardContent className="p-5"><Building2 className="mb-2 h-5 w-5 text-[#0B3C5D]" /><p className="font-semibold">Made for India</p><p className="text-sm text-slate-600">Optimized for low bandwidth and mobile devices.</p></CardContent></Card>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 backdrop-blur md:hidden">
        <nav className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 py-2 text-xs">
          {[
            { label: 'Home', href: '/', icon: Search },
            { label: 'Tools', href: '/tools', icon: Calculator },
            { label: 'Compare', href: '/credit-cards', icon: GitBranch },
            { label: 'Products', href: '/banks', icon: Landmark },
            { label: 'Profile', href: '/about', icon: Wallet },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.href} className="flex flex-col items-center rounded-lg py-1 text-slate-600 hover:bg-slate-100 hover:text-[#0B3C5D]">
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <Footer />
    </div>
  );
}
