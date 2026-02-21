import { Search, Building2, TrendingUp, ArrowRight, GitBranch, Sparkles, Shield, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchFilters } from '@/components/SearchFilters';
import { StatsCards } from '@/components/StatsCards';
import { Loader } from '@/components/Loader';
import { FavoritesSection } from '@/components/FavoritesSection';
import { SearchHistorySection } from '@/components/SearchHistorySection';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getUniqueBanks, getOverallStats, getStatesForBank } from '@/lib/csvParser';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/logo.png';

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
      const statesSet = indices.statesMap.get(bank);
      const stateCount = statesSet ? statesSet.size : 0;

      // Approximate branch count or calculate heavy?
      // Let's use the same traversal logic or maybe for "All Banks" just showing top 12 initially?
      // The UI slices 0-12. So we can just map all of them, but calculation for ALL banks (Wait, there are hundreds) might be slow.
      // Actually unique banks count is probably ~100-200. Calculating stats for 200 banks via map traversal is fast.

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
        stateCount,
        colorClass: BANK_COLORS[index % BANK_COLORS.length],
      };
    }).sort((a, b) => b.branchCount - a.branchCount);
  }, [indices]);


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Enhanced Gradient */}
        <section className="relative pt-4 pb-12 sm:pt-10 sm:pb-20 overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

          {/* Animated background elements */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-5xl mx-auto mb-8 sm:mb-12">
              <div className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-background/50 backdrop-blur-sm border-2 border-primary/20 shadow-lg mb-8 animate-fade-in hover:border-primary/50 transition-all duration-300 group">
                <Sparkles className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  India's Most Trusted IFSC Database
                </span>
                <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
                  FREE
                </Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up leading-tight tracking-tight">
                Find Bank <span className="gradient-text">IFSC Codes</span>
              </h1>
              {loading ? (
                <div className="py-8">
                  <Loader text="Loading Bank Details " />
                </div>
              ) : error ? (
                <div className="text-center text-destructive py-4">{error}</div>
              ) : (
                <div className="animate-slide-up w-full max-w-2xl mx-auto border-2 border-primary/20 rounded-2xl shadow-lg bg-card/30 backdrop-blur-sm" style={{ animationDelay: '0.3s' }}>
                  <SearchFilters data={data} indices={indices} />
                </div>
              )}

              <p className="text-lg sm:text-2xl text-black animate-fade-in max-w-3xl mx-auto font-light mt-8" style={{ animationDelay: '0.2s' }}>
                Search through {loading ? '...' : stats.totalBranches.toLocaleString()}+ bank branches across{' '}
                {loading ? '...' : '28'} states and 8 UTs. <span className="font-medium text-foreground">Quick, accurate, and 100% free.</span>
              </p>

              {/* Quick feature badges */}
              <div className="flex flex-wrap justify-center gap-4 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Badge variant="outline" className="px-4 py-2 gap-2 border-primary/30 bg-primary/5">
                  <Shield className="h-4 w-4 text-primary" />
                  RBI Verified
                </Badge>
                <Badge variant="outline" className="px-4 py-2 gap-2 border-accent/30 bg-accent/5">
                  <Zap className="h-4 w-4 text-accent" />
                  Instant Search
                </Badge>
                <Badge variant="outline" className="px-4 py-2 gap-2 border-secondary/30 bg-secondary/5">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  Always Updated
                </Badge>
              </div>
            </div>
          </div>

        </section>

        {/* Favorites Section */}
        <FavoritesSection />

        {/* Search History Section */}
        <SearchHistorySection />

        {/* Stats Section with Enhanced Styling */}
        <section className="py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-primary/5 to-muted/50" />
          <div className="container mx-auto px-4 relative">
            {loading ? (
              <Loader text="Loading statistics..." />
            ) : (
              <StatsCards stats={stats} variant="gradient" />
            )}
          </div>
        </section>

        {/* Popular Banks Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    <TrendingUp className="h-5 w-5" />
                  </span>
                  Popular Banks
                </h2>
                <p className="text-black">
                  Browse IFSC codes from top Indian banks
                </p>
              </div>
              <Link to="/banks">
                <Button variant="outline" className="hidden sm:flex items-center gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary">
                  View all banks
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <Loader text="Loading banks..." size="lg" />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {popularBanks.map((bank, index) => (
                  <Link
                    key={bank.name}
                    to={`/bank/${encodeURIComponent(bank.name)}`}
                    className="block animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Card className={`h-full border-2 bg-gradient-to-br ${bank.colorClass} hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group overflow-hidden relative`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-1 text-lg">
                          {bank.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-black">
                          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/50">
                            <GitBranch className="h-3.5 w-3.5 text-primary" />
                            {bank.branchCount.toLocaleString()} branches
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-6 sm:hidden">
              <Link to="/banks">
                <Button variant="outline" className="w-full border-primary/30">
                  View all banks
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

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

            {!loading && banks.length > 12 && (
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

        {/* Info Section */}
        <section className="py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex p-2 border-2 border-primary/20 rounded-full mb-6 animate-pulse-glow">
                <img src={logo} alt="IFSC Code" className=" rounded-full h-16 w-16 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 animate-fade-in">
                What is an <span className="gradient-text">IFSC Code</span>?
              </h1>
              <p className="text-lg text-black leading-relaxed animate-fade-in">
                IFSC (Indian Financial System Code) is an 11-character alphanumeric code used for
                electronic fund transfers in India. The first 4 characters represent the bank,
                the 5th is always 0 (reserved for future use), and the last 6 characters identify
                the specific branch. This code is essential for NEFT, RTGS, and IMPS transactions.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mt-10">
                {[
                  { title: 'First 4 Chars', desc: 'Bank Code', example: 'SBIN' },
                  { title: '5th Character', desc: 'Reserved (Always 0)', example: '0' },
                  { title: 'Last 6 Chars', desc: 'Branch Code', example: '000001' },
                ].map((item, index) => (
                  <Card key={index} className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="p-4 text-center">
                      <div className="font-mono text-2xl font-bold text-primary mb-2">{item.example}</div>
                      <div className="font-medium text-foreground">{item.title}</div>
                      <div className="text-sm text-black">{item.desc}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-muted/50 via-primary/5 to-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Search className="h-6 w-6 text-primary" />
                Find IFSC Codes for All Indian Banks
              </h2>
              <div className="prose prose-sm text-black space-y-4">
                <p>
                  Welcome to IFSC Finder, your one-stop destination for finding IFSC codes of all banks in India.
                  Whether you need the IFSC code for State Bank of India, HDFC Bank, ICICI Bank, or any other bank,
                  our comprehensive database has you covered.
                </p>
                <p>
                  <strong className="text-foreground">Why use IFSC Finder?</strong> We provide accurate, RBI-verified IFSC codes
                  for over {stats.totalBranches.toLocaleString()} bank branches across {stats.totalStates} states and union territories.
                  Our database includes all major banks like Punjab National Bank, Bank of Baroda, Canara Bank,
                  Union Bank of India, Axis Bank, and more.
                </p>
                <p>
                  Each IFSC code is essential for:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>NEFT (National Electronic Funds Transfer) transactions</li>
                  <li>RTGS (Real Time Gross Settlement) transfers</li>
                  <li>IMPS (Immediate Payment Service) payments</li>
                  <li>Online banking and mobile banking transfers</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div >
  );
}
