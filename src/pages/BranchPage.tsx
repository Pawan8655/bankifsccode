import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BranchDetails } from '@/components/BranchDetails';
import { useIFSCData } from '@/hooks/useIFSCData';
import { getBranchByIFSC, getBranchesForBankStateCity } from '@/lib/csvParser';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';

import { useMemo } from 'react';

export default function BranchPage() {
  const { ifsc } = useParams();
  const { data, indices, loading, error } = useIFSCData();

  const branch = useMemo(() => {
    if (!ifsc) return undefined;
    return getBranchByIFSC(data, ifsc);
    // Note: We could speed this up by indexing by IFSC, but linear scan is fast enough for single item.
  }, [data, ifsc]);

  const relatedBranches = useMemo(() => {
    if (!branch) return [];
    if (indices && indices.branchesMap.has(branch.Bank)) {
      const cityBranches = indices.branchesMap.get(branch.Bank)?.get(branch.State)?.get(branch.City);
      if (cityBranches) {
        return cityBranches
          .filter(b => b.IFSC !== branch.IFSC)
          .slice(0, 4);
      }
    }
    return getBranchesForBankStateCity(data, branch.Bank, branch.State, branch.City)
      .filter(b => b.IFSC !== branch.IFSC)
      .slice(0, 4);
  }, [branch, data, indices]);


  const breadcrumbItems = branch ? [
    { label: 'Banks', href: '/banks' },
    { label: branch.Bank, href: `/bank/${encodeURIComponent(branch.Bank)}` },
    { label: branch.State, href: `/bank/${encodeURIComponent(branch.Bank)}/${encodeURIComponent(branch.State)}` },
    { label: branch.City, href: `/bank/${encodeURIComponent(branch.Bank)}/${encodeURIComponent(branch.State)}/${encodeURIComponent(branch.City)}` },
    { label: branch.Branch },
  ] : [];

  const seoTitle = branch
    ? `${branch.Bank} ${branch.Branch}, ${branch.City} IFSC Code ${branch.IFSC} | bankifsccode.biz`
    : `IFSC Code ${ifsc || ''} Branch Details | bankifsccode.biz`;

  const seoDescription = branch
    ? `Check ${branch.Bank} ${branch.Branch}, ${branch.City}, ${branch.State} IFSC code ${branch.IFSC}, MICR, address and branch details for safe NEFT, RTGS and IMPS transactions.`
    : `Find branch details using IFSC code ${ifsc || ''}. Get bank, state, city and branch information in one place.`;

  const seoKeywords = branch
    ? `${branch.IFSC}, ${branch.Bank} IFSC code, ${branch.City} IFSC code, ${branch.State} bank IFSC code`
    : `${ifsc || ''} IFSC code, IFSC code branch details, bank IFSC code search`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={`/branch/${encodeURIComponent(ifsc || '')}`}
        keywords={seoKeywords}
      />
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-12">{error}</div>
          ) : !branch ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Branch Not Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find a branch with IFSC code "{ifsc}"
              </p>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Home
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <Breadcrumbs items={breadcrumbItems} />

              <BranchDetails branch={branch} />

              {/* Related Branches */}
              {relatedBranches.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Other Branches in {branch.City}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {relatedBranches.map((b) => (
                      <Link
                        key={b.IFSC}
                        to={`/branch/${b.IFSC}`}
                        className="p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all"
                      >
                        <h3 className="font-medium text-foreground mb-1 line-clamp-1">{b.Branch}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{b.IFSC}</p>
                      </Link>
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
