import { Copy, Check, Phone, MapPin, Building2, Hash, CreditCard, Zap, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IFSCData } from '@/lib/csvParser';
import { toast } from '@/hooks/use-toast';
import { ShareButtons } from './ShareButtons';
import { FavoriteButton } from './FavoriteButton';
import { PDFDownloadButton } from './PDFDownloadButton';
import { useSearchHistory } from '@/hooks/useSearchHistory';

interface BranchDetailsProps {
  branch: IFSCData;
}

export function BranchDetails({ branch }: BranchDetailsProps) {
  const [copied, setCopied] = useState(false);
  const { addToHistory } = useSearchHistory();

  // Add to search history when viewing branch details
  useEffect(() => {
    addToHistory({
      ifsc: branch.IFSC,
      bankName: branch.Bank,
      branchName: branch.Branch,
      city: branch.City,
    });
  }, [branch.IFSC, branch.Bank, branch.Branch, branch.City, addToHistory]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "IFSC code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  // Parse address into separate components
  const parseAddress = (address: string) => {
    if (!address) return { fullAddress: '-', building: '', street: '', area: '', landmark: '', cityPin: '' };

    const parts = address.split(',').map(part => part.trim());
    return {
      fullAddress: address,
      building: parts[0] || '',
      street: parts[1] || '',
      area: parts[2] || '',
      landmark: parts[3] || '',
      cityPin: parts[4] || '',
    };
  };

  const addressParts = parseAddress(branch.Address);

  const details = [
    { label: 'Bank Name', value: branch.Bank, icon: Building2 },
    { label: 'Branch Name', value: branch.Branch, icon: Building2 },
    { label: 'IFSC Code', value: branch.IFSC, icon: Hash, copyable: true },
    { label: 'MICR Code', value: branch.MICR, icon: CreditCard },
    { label: 'Building', value: addressParts.building, icon: MapPin, isAddressPart: true },
    { label: 'Street', value: addressParts.street, icon: MapPin, isAddressPart: true },
    { label: 'Area', value: addressParts.area, icon: MapPin, isAddressPart: true },
    { label: 'Landmark', value: addressParts.landmark, icon: MapPin, isAddressPart: true },
    { label: 'City/PIN', value: addressParts.cityPin, icon: MapPin, isAddressPart: true },
    { label: 'District', value: branch.District, icon: MapPin },
    { label: 'State', value: branch.State, icon: MapPin },
    { label: 'Contact', value: branch.Contact, icon: Phone },
  ];

  // Service availability badges
  const services = [
    { name: 'NEFT', available: branch.NEFT === 'true', color: 'bg-accent/20 text-accent border-accent/30' },
    { name: 'RTGS', available: branch.RTGS === 'true', color: 'bg-primary/20 text-primary border-primary/30' },
    { name: 'IMPS', available: branch.IMPS === 'true', color: 'bg-secondary/20 text-secondary border-secondary/30' },
    { name: 'UPI', available: branch.UPI === 'true', color: 'bg-accent/20 text-accent border-accent/30' },
  ].filter(s => s.available);

  return (
    <Card className="border-2 border-primary/20 overflow-hidden animate-fade-in shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] bg-gradient-to-br from-background via-background to-primary/5">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-b border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-xl animate-bounce">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground animate-slide-in">{branch.Branch}</h2>
              <p className="text-sm text-muted-foreground font-normal">{branch.Bank}</p>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <PDFDownloadButton branch={branch} />
            <FavoriteButton branch={branch} />
            <ShareButtons
              ifsc={branch.IFSC}
              bankName={branch.Bank}
              branchName={branch.Branch}
              address={branch.Address}
            />
          </div>
        </div>

        {/* Service badges */}
        {services.length > 0 && (
          <div className="relative z-10 flex flex-wrap gap-2 mt-4">
            {services.map((service) => (
              <Badge
                key={service.name}
                variant="outline"
                className={`gap-1 border ${service.color} animate-fade-in hover:scale-105 transition-transform duration-200`}
              >
                <Zap className="h-3 w-3" />
                {service.name}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {details.map((detail, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-2 sm:w-40 text-muted-foreground">
                <div className="p-1.5 rounded-lg bg-primary/10 animate-pulse">
                  <detail.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{detail.label}</span>
              </div>
              <div className="flex-1 flex items-center gap-2 flex-wrap">
                <span className={`${detail.copyable ? 'font-mono font-bold text-primary text-lg' : 'text-foreground'} ${detail.isAddressPart ? 'text-sm' : ''}`}>
                  {detail.value || '-'}
                </span>
                {detail.copyable && detail.value && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(detail.value)}
                    className="h-8 px-3 gap-1 border-primary/30 hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-200 shadow-md"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-accent animate-bounce" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
                {/* Google Maps link for full address */}
                {detail.label === 'Building' && addressParts.fullAddress !== '-' && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${addressParts.fullAddress}, ${branch.City}, ${branch.State}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 text-primary hover:from-primary/20 hover:to-accent/20 transition-all duration-300 border border-primary/20 hover:scale-105 shadow-md"
                  >
                    <MapPin className="h-4 w-4" />
                    View on Map
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
