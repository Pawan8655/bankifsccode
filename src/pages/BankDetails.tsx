import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SearchFilters } from '@/components/SearchFilters';
import { StatsCards } from '@/components/StatsCards';
import { StateCard } from '@/components/StateCard';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getBankStats, getStatesForBank, getCitiesForBankAndState } from '@/lib/csvParser';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2 } from 'lucide-react';

export default function BankDetails() {
  const { bankName, stateName, cityName } = useParams();
  const { data, indices, loading, error } = useIFSCData();

  const bank = decodeURIComponent(bankName || '');
  const state = stateName ? decodeURIComponent(stateName) : undefined;
  const city = cityName ? decodeURIComponent(cityName) : undefined;

  // Use indices for optimization if available
  const stats = useMemo(() => {
    if (indices && indices.branchesMap.has(bank)) {
      const bankStates = indices.branchesMap.get(bank)!;
      let totalBranches = 0;
      let totalCities = 0;
      for (const cityMap of bankStates.values()) {
        totalCities += cityMap.size;
        for (const list of cityMap.values()) {
          totalBranches += list.length;
        }
      }
      return {
        totalBranches,
        totalStates: bankStates.size,
        totalCities
      };
    }
    return getBankStats(data, bank);
  }, [data, indices, bank]);

  const states = useMemo(() => {
    if (indices && indices.statesMap.has(bank)) {
      return Array.from(indices.statesMap.get(bank)! || []).sort();
    }
    return getStatesForBank(data, bank);
  }, [data, indices, bank]);

  const stateData = useMemo(() => {
    if (indices) {
      return states.map(s => {
        // get branch count for bank+state
        if (indices.branchesMap.has(bank)) {
          const cityMap = indices.branchesMap.get(bank)!.get(s);
          if (cityMap) {
            let bCount = 0;
            for (const list of cityMap.values()) bCount += list.length;
            return {
              name: s,
              branchCount: bCount,
              cityCount: cityMap.size
            };
          }
        }
        return { name: s, branchCount: 0, cityCount: 0 };
      });
    }

    // Fallback
    const bankData = data.filter(d => d.Bank === bank);
    return states.map(s => {
      const stateRecords = bankData.filter(d => d.State === s);
      return {
        name: s,
        branchCount: stateRecords.length,
        cityCount: new Set(stateRecords.map(d => d.City)).size,
      };
    });
  }, [states, data, indices, bank]);

  // If state is selected, show cities
  const cities = useMemo(() => {
    if (!state) return [];
    if (indices && indices.citiesMap.has(bank)) {
      return Array.from(indices.citiesMap.get(bank)!.get(state) || []).sort();
    }
    return getCitiesForBankAndState(data, bank, state);
  }, [data, indices, bank, state]);

  const cityData = useMemo(() => {
    if (!state) return [];
    if (indices) {
      return cities.map(c => {
        const branches = indices.branchesMap.get(bank)?.get(state)?.get(c);
        return {
          name: c,
          branchCount: branches ? branches.length : 0
        };
      });
    }
    const bankData = data.filter(d => d.Bank === bank);
    return cities.map(c => {
      const cityRecords = bankData.filter(d => d.State === state && d.City === c);
      return {
        name: c,
        branchCount: cityRecords.length,
      };
    });
  }, [cities, data, indices, bank, state]);

  // If city is selected, show branches
  const branches = useMemo(() => {
    if (!city || !state) return [];
    if (indices) {
      return indices.branchesMap.get(bank)?.get(state)?.get(city) || [];
    }
    const bankData = data.filter(d => d.Bank === bank);
    return bankData.filter(d => d.State === state && d.City === city);
  }, [data, indices, bank, state, city]);

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Banks', href: '/banks' },
    { label: bank, href: state ? `/bank/${encodeURIComponent(bank)}` : undefined },
    ...(state ? [{ label: state, href: city ? `/bank/${encodeURIComponent(bank)}/${encodeURIComponent(state)}` : undefined }] : []),
    ...(city ? [{ label: city }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Bank Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{bank}</h1>
                {state && (
                  <p className="text-muted-foreground">
                    {state}{city ? ` → ${city}` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-12">{error}</div>
          ) : (
            <div className="space-y-8">
              {/* Search Filters */}
              <SearchFilters
                data={data}
                indices={indices}
                initialBank={bank}
                initialState={state}
                initialCity={city}
              />


              {/* Stats */}
              <StatsCards stats={stats} />

              {/* Content based on navigation level */}
              {city ? (
                // Show branches for selected city
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Branches in {city} ({branches.length})
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branches.map((branch) => (
                      <a
                        key={branch.IFSC}
                        href={`/branch/${branch.IFSC}`}
                        className="p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all"
                      >
                        <h3 className="font-medium text-foreground mb-1">{branch.Branch}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{branch.IFSC}</p>
                      </a>
                    ))}
                  </div>
                </div>
              ) : state ? (
                // Show cities for selected state
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Cities in {state} ({cities.length})
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cityData.map((c) => (
                      <a
                        key={c.name}
                        href={`/bank/${encodeURIComponent(bank)}/${encodeURIComponent(state)}/${encodeURIComponent(c.name)}`}
                        className="p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all"
                      >
                        <h3 className="font-medium text-foreground mb-1">{c.name}</h3>
                        <p className="text-sm text-muted-foreground">{c.branchCount} branches</p>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                // Show states for bank
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Browse by State ({states.length})
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stateData.map((s) => (
                      <StateCard
                        key={s.name}
                        state={s.name}
                        bankSlug={encodeURIComponent(bank)}
                        branchCount={s.branchCount}
                        cityCount={s.cityCount}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
