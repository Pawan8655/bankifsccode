import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, MapPin, Building, GitBranch, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
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

export function SearchFilters({ data, indices, initialBank, initialState, initialCity }: SearchFiltersProps) {
  const navigate = useNavigate();
  const [bank, setBank] = useState(initialBank || '');
  const [state, setState] = useState(initialState || '');
  const [city, setCity] = useState(initialCity || '');
  const [branch, setBranch] = useState('');
  const [ifscSearch, setIfscSearch] = useState('');
  const [ifscResults, setIfscResults] = useState<IFSCData[]>([]);

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


  useEffect(() => {
    if (initialBank) setBank(initialBank);
    if (initialState) setState(initialState);
    if (initialCity) setCity(initialCity);
  }, [initialBank, initialState, initialCity]);

  useEffect(() => {
    if (ifscSearch.length >= 3) {
      setIfscResults(searchByIFSC(data, ifscSearch));
    } else {
      setIfscResults([]);
    }
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

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-none">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* IFSC Direct Search */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-black" />
              <span className="text-sm font-medium text-black">Quick IFSC Search</span>
            </div>
            <Input
              placeholder="Enter IFSC code (e.g., SBIN0000001)"
              value={ifscSearch}
              onChange={(e) => setIfscSearch(e.target.value.toUpperCase())}
              className="font-mono bg-background"
            />
            {ifscResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
                {ifscResults.map((result) => (
                  <button
                    key={result.IFSC}
                    onClick={() => handleIFSCSelect(result.IFSC)}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border/50 last:border-0"
                  >
                    <div className="font-mono font-semibold text-primary">{result.IFSC}</div>
                    <div className="text-sm text-black">{result.Bank} - {result.Branch}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-black uppercase tracking-wider">Or browse by filters</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Cascading Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SearchableSelect
              label="Select Bank"
              icon={Building2}
              value={bank}
              onChange={handleBankChange}
              options={banks}
              placeholder="Choose a bank"
            />

            <SearchableSelect
              label="Select State"
              icon={MapPin}
              value={state}
              onChange={handleStateChange}
              options={states}
              placeholder={bank ? "Choose a state" : "Select bank first"}
              disabled={!bank}
            />

            <SearchableSelect
              label="Select City"
              icon={Building}
              value={city}
              onChange={handleCityChange}
              options={cities}
              placeholder={state ? "Choose a city" : "Select state first"}
              disabled={!state}
            />

            <SearchableSelect
              label="Select Branch"
              icon={GitBranch}
              value={branch}
              onChange={setBranch}
              items={branches.map(b => ({ value: b.IFSC, label: b.Branch }))}
              placeholder={city ? "Choose a branch" : "Select city first"}
              disabled={!city}
            />
          </div>

          <Button
            onClick={handleSearch}
            disabled={!bank}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            <Search className="h-4 w-4 mr-2" />
            Search IFSC
          </Button>
        </div>
      </CardContent>
    </Card>
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
}

function SearchableSelect({ label, icon: Icon, value, onChange, options, items, placeholder, disabled }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  // Normalize items to a standard structure
  const selectItems = items || options?.map(opt => ({ value: opt, label: opt })) || [];

  // Find current label for display
  const currentLabel = selectItems.find(item => item.value === value)?.label;

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-black">
        <Icon className="h-4 w-4" />
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background font-normal h-12 text-base cursor-pointer hover:border-primary/50 transition-colors shadow-sm"
            disabled={disabled}
          >
            {value ? (
              <span className="truncate">{currentLabel || value}</span>
            ) : (
              <span className="text-muted-foreground truncate">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-11 text-base p-4" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {selectItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label} // Search by label
                    onSelect={() => {
                      onChange(item.value); // Set value (ID/Name)
                      setOpen(false);
                    }}
                    className="cursor-pointer py-3 px-4 text-base aria-selected:bg-primary/10 aria-selected:text-primary hover:bg-primary/5"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-5 w-5",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
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
