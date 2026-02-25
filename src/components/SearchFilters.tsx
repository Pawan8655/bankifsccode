import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Building2, 
  MapPin, 
  Building, 
  GitBranch, 
  Check, 
  ChevronsUpDown,
  X,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  IFSCData,
  IFSCLookup,
  getUniqueBanks,
  getStatesForBank,
  getCitiesForBankAndState,
  getBranchesForBankStateCity,
  searchByIFSC
} from '@/lib/csvParser';

interface SearchFiltersProps {
  data: IFSCData[];
  indices?: IFSCLookup | null;
  initialBank?: string;
  initialState?: string;
  initialCity?: string;
}

// Breakpoint constants for responsive design
const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024
};

export function SearchFilters({ data, indices, initialBank, initialState, initialCity }: SearchFiltersProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bank, setBank] = useState(initialBank || '');
  const [state, setState] = useState(initialState || '');
  const [city, setCity] = useState(initialCity || '');
  const [branch, setBranch] = useState('');
  const [ifscSearch, setIfscSearch] = useState('');
  const [ifscResults, setIfscResults] = useState<IFSCData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Optimized derivation using indices if available
  const banks = useMemo(() => {
    if (indices) return indices.banks;
    return getUniqueBanks(data);
  }, [data, indices]);

  const states = useMemo(() => {
    if (!bank) return [];
    if (indices) {
      const stateSet = indices.statesMap.get(bank);
      return stateSet ? Array.from(stateSet).sort() : [];
    }
    return getStatesForBank(data, bank);
  }, [data, indices, bank]);

  const cities = useMemo(() => {
    if (!bank || !state) return [];
    if (indices) {
      const citySet = indices.citiesMap.get(bank)?.get(state);
      return citySet ? Array.from(citySet).sort() : [];
    }
    return getCitiesForBankAndState(data, bank, state);
  }, [data, indices, bank, state]);

  const branches = useMemo(() => {
    if (!bank || !state || !city) return [];
    if (indices) {
      const branchList = indices.branchesMap.get(bank)?.get(state)?.get(city);
      return branchList ? [...branchList].sort((a, b) => a.Branch.localeCompare(b.Branch)) : [];
    }
    return getBranchesForBankStateCity(data, bank, state, city);
  }, [data, indices, bank, state, city]);

  // Reset dependent fields when parent changes
  useEffect(() => {
    if (!bank) {
      setState('');
      setCity('');
      setBranch('');
    }
  }, [bank]);

  useEffect(() => {
    if (!state) {
      setCity('');
      setBranch('');
    }
  }, [state]);

  useEffect(() => {
    if (!city) {
      setBranch('');
    }
  }, [city]);

  // Initialize from props
  useEffect(() => {
    if (initialBank) setBank(initialBank);
    if (initialState) setState(initialState);
    if (initialCity) setCity(initialCity);
  }, [initialBank, initialState, initialCity]);

  // IFSC search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ifscSearch.length >= 3) {
        setIsSearching(true);
        const results = searchByIFSC(data, ifscSearch);
        setIfscResults(results);
        setIsSearching(false);
      } else {
        setIfscResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [ifscSearch, data]);

  const handleBankChange = (value: string) => {
    setBank(value);
    setState('');
    setCity('');
    setBranch('');
  };

  const handleStateChange = (value: string) => {
    setState(value);
    setCity('');
    setBranch('');
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setBranch('');
  };

  const handleSearch = () => {
    if (branch) {
      const selectedBranch = branches.find(b => b.IFSC === branch);
      if (selectedBranch) {
        navigate(`/branch/${selectedBranch.IFSC}`);
      }
    } else if (city) {
      navigate(`/bank/${encodeURIComponent(bank)}/${encodeURIComponent(state)}/${encodeURIComponent(city)}`);
    } else if (state) {
      navigate(`/bank/${encodeURIComponent(bank)}/${encodeURIComponent(state)}`);
    } else if (bank) {
      navigate(`/bank/${encodeURIComponent(bank)}`);
    }
  };

  const handleIFSCSelect = (ifsc: string) => {
    navigate(`/branch/${ifsc}`);
    setIfscSearch('');
    setIfscResults([]);
  };

  const clearFilters = () => {
    setBank('');
    setState('');
    setCity('');
    setBranch('');
    setIfscSearch('');
    setIfscResults([]);
  };

  const hasActiveFilters = bank || state || city || branch || ifscSearch;

  // Filter chips for mobile view
  const FilterChips = () => (
    <div className="flex flex-wrap gap-2 sm:hidden">
      {bank && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Building2 className="h-3 w-3" />
          {bank}
        </Badge>
      )}
      {state && (
        <Badge variant="outline" className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {state}
        </Badge>
      )}
      {city && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Building className="h-3 w-3" />
          {city}
        </Badge>
      )}
    </div>
  );

  return (
    <Card className="bg-card/50 backdrop-blur-sm border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between sm:hidden">
            <h3 className="font-semibold text-lg">Search IFSC Codes</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* IFSC Direct Search - Enhanced for mobile */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium">Quick IFSC Search</span>
            </div>
            <div className="relative">
              <Input
                placeholder="Enter IFSC code (e.g., SBIN0000001)"
                value={ifscSearch}
                onChange={(e) => setIfscSearch(e.target.value.toUpperCase())}
                className={cn(
                  "font-mono bg-background pr-10",
                  "focus-visible:ring-2 focus-visible:ring-primary/20",
                  "placeholder:text-sm sm:placeholder:text-base"
                )}
              />
              {ifscSearch && (
                <button
                  onClick={() => setIfscSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {/* IFSC Results */}
              {ifscResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-[300px] sm:max-h-80 overflow-auto">
                  {ifscResults.map((result) => (
                    <button
                      key={result.IFSC}
                      onClick={() => handleIFSCSelect(result.IFSC)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-accent transition-colors border-b last:border-0"
                    >
                      <div className="font-mono font-semibold text-primary text-sm sm:text-base">
                        {result.IFSC}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                        {result.Bank} - {result.Branch}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Loading indicator */}
              {isSearching && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          <Separator className="sm:hidden" />

          {/* Mobile View: Filter Chips and Toggle */}
          <div className="sm:hidden space-y-3">
            <FilterChips />
            
            <Button
              variant="outline"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full justify-between"
            >
              <span>Browse by filters</span>
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform",
                isMobileMenuOpen && "rotate-90"
              )} />
            </Button>

            {/* Mobile Filters */}
            {isMobileMenuOpen && (
              <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
                <MobileFilters
                  banks={banks}
                  states={states}
                  cities={cities}
                  branches={branches}
                  bank={bank}
                  state={state}
                  city={city}
                  branch={branch}
                  onBankChange={handleBankChange}
                  onStateChange={handleStateChange}
                  onCityChange={handleCityChange}
                  onBranchChange={setBranch}
                />
              </div>
            )}
          </div>

          {/* Desktop View: Full Filters */}
          <div className="hidden sm:block">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider shrink-0">
                Or browse by filters
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <SearchableSelect
                label="Bank"
                icon={Building2}
                value={bank}
                onChange={handleBankChange}
                options={banks}
                placeholder="Select bank"
              />

              <SearchableSelect
                label="State"
                icon={MapPin}
                value={state}
                onChange={handleStateChange}
                options={states}
                placeholder={bank ? "Select state" : "Select bank first"}
                disabled={!bank}
              />

              <SearchableSelect
                label="City"
                icon={Building}
                value={city}
                onChange={handleCityChange}
                options={cities}
                placeholder={state ? "Select city" : "Select state first"}
                disabled={!state}
              />

              <SearchableSelect
                label="Branch"
                icon={GitBranch}
                value={branch}
                onChange={setBranch}
                items={branches.map(b => ({ value: b.IFSC, label: b.Branch }))}
                placeholder={city ? "Select branch" : "Select city first"}
                disabled={!city}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Button
              onClick={handleSearch}
              disabled={!bank}
              size="lg"
              className={cn(
                "w-full sm:w-auto min-w-[160px]",
                "bg-primary hover:bg-primary/90",
                "transition-transform active:scale-[0.98]"
              )}
            >
              <Search className="h-4 w-4 mr-2" />
              Search IFSC
            </Button>
            
            {/* Desktop clear button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="hidden sm:inline-flex text-muted-foreground"
              >
                Clear all filters
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile Filters Component
function MobileFilters({ 
  banks, states, cities, branches,
  bank, state, city, branch,
  onBankChange, onStateChange, onCityChange, onBranchChange 
}: any) {
  return (
    <div className="space-y-4">
      <SearchableSelect
        label="Bank"
        icon={Building2}
        value={bank}
        onChange={onBankChange}
        options={banks}
        placeholder="Select bank"
        mobile
      />

      <SearchableSelect
        label="State"
        icon={MapPin}
        value={state}
        onChange={onStateChange}
        options={states}
        placeholder={bank ? "Select state" : "Select bank first"}
        disabled={!bank}
        mobile
      />

      <SearchableSelect
        label="City"
        icon={Building}
        value={city}
        onChange={onCityChange}
        options={cities}
        placeholder={state ? "Select city" : "Select state first"}
        disabled={!state}
        mobile
      />

      <SearchableSelect
        label="Branch"
        icon={GitBranch}
        value={branch}
        onChange={onBranchChange}
        items={branches.map((b: IFSCData) => ({ value: b.IFSC, label: b.Branch }))}
        placeholder={city ? "Select branch" : "Select city first"}
        disabled={!city}
        mobile
      />
    </div>
  );
}

interface SearchableSelectProps {
  label: string;
  icon: any;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  items?: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
  mobile?: boolean;
}

function SearchableSelect({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  options, 
  items, 
  placeholder, 
  disabled,
  mobile 
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  const selectItems = items || options?.map(opt => ({ value: opt, label: opt })) || [];
  const currentLabel = selectItems.find(item => item.value === value)?.label;

  return (
    <div className="space-y-1.5 sm:space-y-2">
      <label className={cn(
        "flex items-center gap-2 text-xs sm:text-sm font-medium",
        disabled && "opacity-50"
      )}>
        <Icon className={cn("shrink-0", mobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
        {label}
      </label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between bg-background",
              "font-normal hover:border-primary/50 transition-colors",
              "focus-visible:ring-2 focus-visible:ring-primary/20",
              mobile ? "h-10 text-sm" : "h-12 text-base",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <span className="truncate">
              {value ? currentLabel || value : placeholder}
            </span>
            <ChevronsUpDown className={cn(
              "shrink-0 opacity-50",
              mobile ? "ml-1 h-4 w-4" : "ml-2 h-5 w-5"
            )} />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className={cn(
            "p-0",
            mobile ? "w-[calc(100vw-2rem)]" : "w-[var(--radix-popover-trigger-width)]"
          )} 
          align="start"
          sideOffset={5}
        >
          <Command>
            <CommandInput 
              placeholder={`Search ${label.toLowerCase()}...`} 
              className={cn(
                mobile ? "h-10 text-sm" : "h-11 text-base"
              )} 
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {selectItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "cursor-pointer aria-selected:bg-primary/10",
                      mobile ? "py-2.5 px-3 text-sm" : "py-3 px-4 text-base"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 shrink-0",
                        mobile ? "h-4 w-4" : "h-5 w-5",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="line-clamp-2">{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
