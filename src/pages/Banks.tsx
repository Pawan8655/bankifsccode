import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BankCard } from '@/components/BankCard';
import { Input } from '@/components/ui/input';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getUniqueBanks, getStatesForBank } from '@/lib/csvParser';
import { Loader } from '@/components/Loader';

export default function Banks() {
  const { data, indices, loading, error } = useIFSCData();
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  const banks = useMemo(() => {
    return indices ? indices.banks : getUniqueBanks(data);
  }, [data, indices]);

  const filteredBanks = useMemo(() => {
    if (!searchQuery) return banks;
    return banks.filter(bank =>
      bank.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [banks, searchQuery]);

  const bankData = useMemo(() => {
    if (indices) {
      return filteredBanks.map(bank => {
        // Calculate stats from indices
        let branchCount = 0;
        let stateCount = 0;
        if (indices.branchesMap.has(bank)) {
          const bankStates = indices.branchesMap.get(bank)!;
          stateCount = bankStates.size;
          for (const cityMap of bankStates.values()) {
            for (const list of cityMap.values()) {
              branchCount += list.length;
            }
          }
        }
        return { name: bank, branchCount, stateCount };
      });
    }

    return filteredBanks.map(bank => ({
      name: bank,
      branchCount: data.filter(d => d.Bank === bank).length,
      stateCount: getStatesForBank(data, bank).length,
    }));
  }, [filteredBanks, data, indices]);


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: 'All Banks' }]} />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">All Banks</h1>
            <p className="text-muted-foreground">
              Browse IFSC codes by selecting a bank from the list below
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search banks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader text="Loading Banks..." size="lg" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-12">{error}</div>
          ) : filteredBanks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No banks found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bankData.map((bank) => (
                <BankCard
                  key={bank.name}
                  bank={bank.name}
                  branchCount={bank.branchCount}
                  stateCount={bank.stateCount}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
