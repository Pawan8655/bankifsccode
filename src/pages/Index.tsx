import { Search, Building2, TrendingUp, ArrowRight, GitBranch, Sparkles, Shield, Zap, Calculator, BookOpen } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Building2, BookOpen } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchFilters } from '@/components/SearchFilters';
import { Loader } from '@/components/Loader';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getUniqueBanks, getOverallStats } from '@/lib/csvParser';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';

const featuredTools = [
  { title: 'EMI Calculator', slug: '/emi-calculator' },
  { title: 'SIP Calculator', slug: '/sip-calculator' },
  { title: 'FD Calculator', slug: '/fd-calculator' },
  { title: 'Tax Calculator', slug: '/income-tax-calculator-india' },
  { title: 'Net Worth Calculator', slug: '/net-worth-calculator' },
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/logo.png';
import { SEO } from '@/components/SEO';

// Famous banks in India with priority order
const FAMOUS_BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'Axis Bank',
  'Indian Overseas Bank',
  'Kotak Mahindra Bank',
  'IndusInd Bank',
  'Yes Bank',
];

// Bank colors for visual interest
const BANK_COLORS = [
  'from-primary/20 to-primary/5 border-primary/30',
  'from-secondary/20 to-secondary/5 border-secondary/30',
  'from-accent/20 to-accent/5 border-accent/30',
  'from-primary/15 to-accent/10 border-primary/20',
  'from-secondary/15 to-primary/10 border-secondary/20',
  'from-accent/15 to-secondary/10 border-accent/20',
];

export default function Index() {
  const { data, indices, loading, error } = useIFSCData();

  const banks = useMemo(() => (indices ? indices.banks : getUniqueBanks(data)).slice(0, 8), [data, indices]);
  const stats = useMemo(() => getOverallStats(data), [data]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-16 md:pb-0">
      <SEO
        title="All-in-One Financial Tools & IFSC Search | bankifsccode.biz"
        description="bankifsccode.biz offers bank IFSC search and 50+ free financial tools online including EMI, SIP, FD, tax, inflation, and budget planning calculators."
  const banks = useMemo(() => {
    return indices ? indices.banks : getUniqueBanks(data);
  }, [data, indices]);

  const stats = useMemo(() => {
    return getOverallStats(data);
  }, [data]);

  // Get famous banks that exist in data, maintaining priority order
  const popularBanks = useMemo(() => {
    if (!indices) return [];

    return FAMOUS_BANKS
      .filter(bank => indices.banks.includes(bank))
      .slice(0, 12)
      .map((bank, index) => {
        // Calculate counts using indices if possible or fallback to data scan (expensive but done once here)
        // Since we have indices, let's use the maps to be faster
        const statesSet = indices.statesMap.get(bank);
        const stateCount = statesSet ? statesSet.size : 0;

        let branchCount = 0;
        if (indices.branchesMap.has(bank)) {
          // This traversal is faster than filtering 160k rows
          const bankStates = indices.branchesMap.get(bank)!;
          for (const cityMap of bankStates.values()) {
            for (const branchList of cityMap.values()) {
              branchCount += branchList.length;
            }
          }
        }

        return {
          name: bank,
          branchCount,
          stateCount,
          colorClass: BANK_COLORS[index % BANK_COLORS.length],
        };
      });
  }, [indices]);

  // Get all banks for the "All Banks" section
  // Memoize this heavy sort/map operation
  const allBanksData = useMemo(() => {
    if (!indices) return [];

    return indices.banks.map((bank, index) => {
      let branchCount = 0;
      if (indices.branchesMap.has(bank)) {
        const bankStates = indices.branchesMap.get(bank)!;
        for (const cityMap of bankStates.values()) {
          for (const branchList of cityMap.values()) {
            branchCount += branchList.length;
          }
        }
      }

      return {
        name: bank,
        branchCount,
        colorClass: BANK_COLORS[index % BANK_COLORS.length],
      };
    }).sort((a, b) => b.branchCount - a.branchCount).slice(0, 24);
  }, [indices]);


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Bank IFSC Code Search & Financial Calculators India | bankifsccode.biz"
        description="Search any bank IFSC code instantly and use bankifsccode.biz tools like EMI and SIP calculators. Explore financial calculators India users trust."
        path="/"
      />
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-10">
          <div className="rounded-2xl bg-white border p-6 md:p-10">
            <h1 className="text-3xl md:text-5xl font-bold text-[#1e3a8a]">All-in-One Financial Tools</h1>
            <p className="mt-4 text-slate-600 max-w-3xl">Search bank IFSC codes and use professional financial tools online. Fast, mobile-friendly, and built for smart planning.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/tools"><Button className="bg-[#1e3a8a] hover:bg-[#1e40af]">Explore Tools <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <Link to="/blogs"><Button variant="outline">Read Blogs</Button></Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <div className="rounded-2xl bg-white border p-6">
            <h2 className="text-2xl font-semibold">IFSC Code Finder</h2>
            <p className="text-slate-600 mt-2">Find accurate branch-level details for NEFT, RTGS and IMPS transfers.</p>
            <div className="mt-4">
              {loading ? <Loader text="Loading IFSC data..." /> : error ? <p className="text-red-600">{error}</p> : <SearchFilters data={data} indices={indices} />}
            </div>
            <p className="mt-4 text-sm text-slate-500">{loading ? '...' : stats.totalBranches.toLocaleString()} branches indexed.</p>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2"><Calculator className="h-5 w-5 text-[#1e3a8a]" /> Featured Tools</h2>
            <Link className="text-[#1e3a8a] text-sm font-medium" to="/tools">View all 50+ tools</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {featuredTools.map((tool) => (
              <Link key={tool.slug} to={tool.slug} className="bg-white border rounded-xl p-4 hover:border-[#1e3a8a]">
                <h3 className="font-semibold">{tool.title}</h3>
                <p className="text-xs text-slate-500 mt-1">Open calculator</p>
              </Link>
            ))}
        {/* All Banks Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-muted/50 via-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-gradient-to-br from-secondary to-accent text-secondary-foreground">
                  <Building2 className="h-5 w-5" />
                </span>
                All Banks ({loading ? '...' : banks.length})
              </h2>
              <p className="text-black">
                Complete list of banks with IFSC codes
              </p>
            </div>

            {loading ? (
              <Loader text="Loading all banks..." size="lg" />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allBanksData.slice(0, 12).map((bank, index) => (
                  <Link
                    key={bank.name}
                    to={`/bank/${encodeURIComponent(bank.name)}`}
                    className="block animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Card className={`h-full border bg-gradient-to-r ${bank.colorClass} hover:shadow-lg transition-all duration-300 group`}>
                      <CardContent className="p-5">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-2">
                          {bank.name}
                        </h3>
                        <p className="text-sm text-black flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          {bank.branchCount.toLocaleString()} branches
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {!loading && banks.length > allBanksData.length && (
              <div className="mt-8 text-center">
                <Link to="/banks">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg">
                    View All {banks.length} Banks
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4"><Building2 className="h-5 w-5 text-[#1e3a8a]" /> Popular Banks</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {banks.map((bank) => (
              <Link key={bank} to={`/bank/${encodeURIComponent(bank)}`}>
                <Card className="hover:border-[#1e3a8a] bg-white"><CardContent className="p-4"><p className="font-medium">{bank}</p></CardContent></Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4"><BookOpen className="h-5 w-5 text-[#1e3a8a]" /> Latest Blogs</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              'Best EMI Calculator in India (2026 Guide)',
              'How to Calculate SIP Returns Easily',
              'Top Free Financial Tools for Smart Planning',
            ].map((title) => (
              <Link key={title} to="/blogs" className="bg-white border rounded-xl p-5 hover:border-[#1e3a8a]">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-slate-500 mt-2">Read full article with internal tool links.</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Featured Tools</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/emi-calculator" className="rounded-xl border p-5 hover:bg-primary/5 transition-colors">
                <h3 className="font-semibold flex items-center gap-2"><Calculator className="h-4 w-4 text-primary" /> EMI Calculator</h3>
                <p className="text-sm text-muted-foreground mt-2">Calculate monthly EMI, total interest, and repayment with chart-based insights.</p>
              </Link>
              <Link to="/sip-calculator" className="rounded-xl border p-5 hover:bg-primary/5 transition-colors">
                <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" /> SIP Calculator</h3>
                <p className="text-sm text-muted-foreground mt-2">Estimate long-term wealth growth for monthly SIP investments in India.</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Categories</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ['Bank IFSC Code Lookup', '/banks'],
                ['Loan Calculators', '/emi-calculator'],
                ['Investment Calculators', '/sip-calculator'],
                ['Financial Education Blogs', '/blogs'],
              ].map(([title, href]) => (
                <Link key={title} to={href} className="rounded-xl border bg-background p-4 font-medium hover:border-primary/40">{title}</Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Latest Financial Articles</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                ['How to verify a bank IFSC code before transfer', '/blogs'],
                ['EMI vs tenure: how to reduce total interest paid', '/emi-calculator'],
                ['SIP planning for long-term financial goals in India', '/sip-calculator'],
              ].map(([title, href]) => (
                <Link key={title} to={href} className="rounded-xl border p-5 hover:shadow-sm transition-shadow">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">Read practical guidance and apply with our free tools.</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
