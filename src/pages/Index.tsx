import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Landmark, MapPin, Search, Shield, Building, Map, GitBranch, CheckCircle2, CreditCard, WalletCards, BriefcaseBusiness, HandCoins, ShieldCheck, ChartNoAxesCombined, Eye, Sparkles, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader } from '@/components/Loader';
import { StatsCards } from '@/components/StatsCards';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getBranchByIFSC, getOverallStats } from '@/lib/csvParser';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SEO } from '@/components/SEO';
import { TOOL_CATALOG } from '@/data/toolCatalog';
import blogs from './blogsData';

const POPULAR_SEARCHES = [
  { label: 'SBI Mumbai IFSC', bank: 'State Bank of India', state: 'MAHARASHTRA', city: 'MUMBAI' },
  { label: 'HDFC Delhi IFSC', bank: 'HDFC Bank', state: 'DELHI', city: 'DELHI' },
  { label: 'ICICI Bangalore IFSC', bank: 'ICICI Bank', state: 'KARNATAKA', city: 'BANGALORE' },
];

const POPULAR_BANK_LINKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank'];

const PRODUCT_CATEGORIES = [
  {
    id: 'credit-card',
    name: 'Credit Card',
    icon: CreditCard,
    image: 'https://images.unsplash.com/photo-1556742205-e10c9486e506?auto=format&fit=crop&w=900&q=80',
    products: [
      { name: 'Cashback Credit Card', description: 'Online shopping, utility bills aur fuel spends par cashback benefits.', image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=900&q=80' },
      { name: 'Travel Rewards Card', description: 'Air miles, lounge access aur hotel booking points ke saath premium travel card.', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=900&q=80' , featured: true },
    ],
  },
  {
    id: 'bank-account',
    name: 'Bank Account',
    icon: WalletCards,
    image: 'https://images.unsplash.com/photo-1565514020179-026b92b2d201?auto=format&fit=crop&w=900&q=80',
    products: [
      { name: 'Savings Account', description: 'Daily banking aur interest earning ke liye zero balance/regular savings options.', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=900&q=80' },
      { name: 'Current Account', description: 'Business transactions ke liye high transaction limit aur overdraft support.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80' },
    ],
  },
  {
    id: 'demat-account',
    name: 'Demat Account',
    icon: BriefcaseBusiness,
    image: 'https://images.unsplash.com/photo-1640158615954-9f2f6086d8d6?auto=format&fit=crop&w=900&q=80',
    products: [
      { name: 'Basic Demat Account', description: 'Shares aur mutual fund units hold karne ke liye beginner-friendly demat option.', image: 'https://images.unsplash.com/photo-1569025690938-a00729c9e1df?auto=format&fit=crop&w=900&q=80' },
      { name: 'Trader Demat + Trading', description: 'Advanced charting aur low brokerage plans ke saath active trader package.', image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a0?auto=format&fit=crop&w=900&q=80' },
    ],
  },
  {
    id: 'loan',
    name: 'Loan',
    icon: HandCoins,
    image: 'https://images.unsplash.com/photo-1616077167599-cad3639f0f54?auto=format&fit=crop&w=900&q=80',
    products: [
      { name: 'Home Loan', description: 'New home purchase aur balance transfer ke liye competitive home loan rates.', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80' },
      { name: 'Personal Loan', description: 'Instant disbursal ke saath wedding, travel ya emergency ke liye unsecured loan.', image: 'https://images.unsplash.com/photo-1629721671030-a83edbb11211?auto=format&fit=crop&w=900&q=80' },
    ],
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1633158829875-e5316a358c6f?auto=format&fit=crop&w=900&q=80',
    products: [
      { name: 'Health Insurance', description: 'Family floater plans with hospitalization cover, cashless hospitals aur add-ons.', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80' },
      { name: 'Term Life Insurance', description: 'Affordable premium ke saath high life cover protection plan.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80' },
    ],
  },
  {
    id: 'mutual-fund',
    name: 'Mutual Fund',
    icon: ChartNoAxesCombined,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    products: [
      { name: 'Equity Mutual Fund', description: 'Long-term wealth creation ke liye diversified equity scheme options.', image: 'https://images.unsplash.com/photo-1642052502050-3944ad47402f?auto=format&fit=crop&w=900&q=80' },
      { name: 'Debt Mutual Fund', description: 'Lower volatility aur short/medium term goals ke liye debt-oriented funds.', image: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=900&q=80' },
    ],
  },
] as const;

const encode = (value: string) => encodeURIComponent(value);
const buildBranchPath = (bank: string, state: string, city: string, branch: string) => `/bank/${encode(bank)}/${encode(state)}/${encode(city)}/${encode(branch)}`;

export default function Index() {
  const navigate = useNavigate();
  const { data, indices, loading, error } = useIFSCData();

  const [bank, setBank] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [branch, setBranch] = useState('');
  const [ifscQuick, setIfscQuick] = useState('');
  const [activeProductCategory, setActiveProductCategory] = useState(PRODUCT_CATEGORIES[0].id);

  const stats = useMemo(() => getOverallStats(data), [data]);

  const banks = useMemo(() => indices?.banks ?? [], [indices]);
  const states = useMemo(() => (bank ? Array.from(indices?.statesMap.get(bank) ?? []).sort() : []), [bank, indices]);
  const cities = useMemo(() => (bank && state ? Array.from(indices?.citiesMap.get(bank)?.get(state) ?? []).sort() : []), [bank, state, indices]);
  const branches = useMemo(() => {
    if (!bank || !state || !city) return [];
    const branchRows = indices?.branchesMap.get(bank)?.get(state)?.get(city) ?? [];
    return [...new Set(branchRows.map((item) => item.Branch))].sort();
  }, [bank, state, city, indices]);

  const latestBlogs = useMemo(() => blogs.slice(0, 5), []);
  const visibleProducts = useMemo(
    () => PRODUCT_CATEGORIES.find((item) => item.id === activeProductCategory) ?? PRODUCT_CATEGORIES[0],
    [activeProductCategory],
  );
  const featuredProduct = useMemo(
    () => visibleProducts.products.find((product) => 'featured' in product && product.featured) ?? visibleProducts.products[0],
    [visibleProducts],
  );

  const onSearch = () => {
    if (!bank || !state || !city || !branch) return;
    navigate(buildBranchPath(bank, state, city, branch));
  };

  const onQuickIFSCSearch = () => {
    const found = getBranchByIFSC(data, ifscQuick.trim());
    if (!found) return;
    navigate(buildBranchPath(found.Bank, found.State, found.City, found.Branch));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title="IFSC Code Finder – Bank IFSC Search India | bankifsccode"
        description="Find IFSC code, MICR code, and bank branch details across India instantly."
        path="/"
        keywords="IFSC code finder, bank IFSC search, MICR code India"
        schema={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'IFSC code kya hota hai?', acceptedAnswer: { '@type': 'Answer', text: 'IFSC bank branch ka unique 11-character code hota hai jo online transfer routing ke liye use hota hai.' } },
                { '@type': 'Question', name: 'MICR code India ka use kya hai?', acceptedAnswer: { '@type': 'Answer', text: 'MICR code cheque clearing aur branch identification ke liye use hota hai.' } },
              ],
            },
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
          ],
        }}
      />

      <Header />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-100/70">
          <div className="container mx-auto px-4 py-10 sm:py-14">
            <div className="mx-auto max-w-5xl text-center">
              <Badge className="mb-4 border-0 bg-primary text-primary-foreground">Fast IFSC Search Experience</Badge>
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">IFSC Code Finder – Bank IFSC Search India</h1>
              <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-600 sm:text-base">Powerful dependent dropdown search ke saath bank, state, city, branch select karo aur instantly branch page open karo with IFSC, MICR, address aur contact details.</p>
            </div>

            <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Field icon={Building} label="Select Bank">
                  <select value={bank} onChange={(e) => { setBank(e.target.value); setState(''); setCity(''); setBranch(''); }} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm">
                    <option value="">Select Bank</option>
                    {banks.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>

                <Field icon={Map} label="Select State">
                  <select value={state} onChange={(e) => { setState(e.target.value); setCity(''); setBranch(''); }} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" disabled={!bank}>
                    <option value="">Select State</option>
                    {states.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>

                <Field icon={MapPin} label="Select City">
                  <select value={city} onChange={(e) => { setCity(e.target.value); setBranch(''); }} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" disabled={!state}>
                    <option value="">Select City</option>
                    {cities.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>

                <Field icon={GitBranch} label="Select Branch">
                  <select value={branch} onChange={(e) => setBranch(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm" disabled={!city}>
                    <option value="">Select Branch</option>
                    {branches.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </Field>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button onClick={onSearch} disabled={!branch} className="h-11 rounded-lg px-6">
                  <Search className="mr-2 h-4 w-4" /> Search IFSC Code
                </Button>
                <div className="flex w-full max-w-md gap-2">
                  <Input placeholder="Quick search by IFSC (e.g. SBIN0001234)" value={ifscQuick} onChange={(e) => setIfscQuick(e.target.value.toUpperCase())} className="h-11" />
                  <Button variant="outline" onClick={onQuickIFSCSearch} disabled={!ifscQuick.trim()}>
                    Quick Search
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="font-semibold text-slate-600">Popular searches:</span>
                {POPULAR_SEARCHES.map((item) => (
                  <button key={item.label} className="rounded-full border px-3 py-1 hover:bg-slate-100" onClick={() => {
                    setBank(item.bank);
                    setState(item.state);
                    setCity(item.city);
                    setBranch('');
                  }}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 sm:py-10">{loading ? <Loader text="Loading IFSC data..." /> : <StatsCards stats={stats} variant="gradient" />}{error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}</section>

        <section id="financial-products" className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold">🛍️ Products Category Wise</h2>
          <p className="mt-2 text-sm text-slate-600">Credit Card, Bank Account, Demat Account, Loan, Insurance aur Mutual Fund products ko category image aur product image ke saath view karein.</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" /> Premium curated products with quick visual comparison
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = category.id === activeProductCategory;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveProductCategory(category.id)}
                  className={`overflow-hidden rounded-xl border bg-white text-left transition hover:border-primary/40 ${isActive ? 'ring-2 ring-primary/40' : ''}`}
                >
                  <img src={category.image} alt={`${category.name} category`} className="h-36 w-full object-cover" loading="lazy" />
                  <div className="flex items-center gap-2 p-4">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{category.name}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">{visibleProducts.name} Products</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {visibleProducts.products.map((product) => (
                <Card key={product.name} className="overflow-hidden">
                  <img src={product.image} alt={product.name} className="h-44 w-full object-cover" loading="lazy" />
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge className="inline-flex gap-1 bg-slate-800 text-white"><Eye className="h-3.5 w-3.5" /> View Product</Badge>
                      <Badge variant="secondary">Top Pick</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mt-6 overflow-hidden border-primary/20 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 text-white">
            <CardContent className="grid gap-4 p-6 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">Featured Product</p>
                <h3 className="mt-2 text-2xl font-semibold">{featuredProduct.name}</h3>
                <p className="mt-2 text-sm text-indigo-100">{featuredProduct.description}</p>
                <div className="mt-4">
                  <Link to="/tools" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-indigo-50">
                    Compare with Calculators <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <img src={featuredProduct.image} alt={`${featuredProduct.name} featured`} className="h-48 w-full rounded-xl object-cover md:h-56" loading="lazy" />
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <Card><CardContent className="p-6">
            <h2 className="text-2xl font-semibold">🏦 About IFSC Code</h2>
            <p className="mt-3 text-sm text-slate-700">IFSC code (Indian Financial System Code) ek unique 11-character bank branch code hai. Online transaction mein correct IFSC use karna important hai taaki amount sahi branch mein safely transfer ho.</p>
          </CardContent></Card>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold">🔍 How to Use IFSC Finder</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {['Bank select karein', 'State aur City choose karein', 'Branch select karke Search IFSC Code button click karein'].map((step) => (
              <Card key={step}><CardContent className="p-4 flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" /><p className="text-sm">{step}</p></CardContent></Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold">⚡ Popular Banks</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {POPULAR_BANK_LINKS.map((b) => <Link key={b} to={`/bank/${encode(b)}`} className="rounded-full border bg-white px-4 py-2 text-sm hover:bg-slate-100">{b}</Link>)}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold">🧮 Financial Calculators</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { title: 'EMI Calculator', href: '/emi-calculator' },
              { title: 'SIP Calculator', href: '/sip-calculator' },
              { title: 'FD Calculator', href: '/fd-calculator' },
            ].map((tool) => (
              <Link key={tool.title} to={tool.href} className="rounded-xl border bg-white p-4 hover:border-primary/40">
                <h3 className="font-semibold">{tool.title}</h3>
                <p className="text-sm text-slate-600 mt-2">Use {tool.title.toLowerCase()} for fast planning and better financial decisions.</p>
              </Link>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-600">Total tools available: <strong>{TOOL_CATALOG.length}+</strong></p>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold">📝 Latest Blog Posts</h2>
          <div className="mt-4 space-y-3">
            {latestBlogs.map((post) => (
              <Link key={post.id} to="/blogs" className="block rounded-lg border bg-white p-4 hover:border-primary/40">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{post.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-slate-700" /><h2 className="text-2xl font-semibold">FAQ</h2></div>
          <div className="space-y-3">
            {[
              ['IFSC code finder se kya milta hai?', 'Aapko IFSC, MICR code India details, address, bank branch details milte hain.'],
              ['Bank IFSC search ka best method?', 'Bank + state + city + branch dependent dropdown method sabse accurate hota hai.'],
              ['Kya direct IFSC se search kar sakte hain?', 'Haan, quick search input mein IFSC daal ke direct branch page open kar sakte hain.'],
              ['MICR code India kahan use hota hai?', 'Cheque processing aur ECS workflow mein use hota hai.'],
            ].map(([q, a]) => (
              <Card key={q}><CardContent className="p-4"><h3 className="font-semibold">{q}</h3><p className="mt-2 text-sm text-slate-600">{a}</p></CardContent></Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: typeof Building2; label: string; children: ReactNode }) {
  return (
    <label className="space-y-1 text-left">
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600"><Icon className="h-3.5 w-3.5" /> {label}</span>
      {children}
    </label>
  );
}
