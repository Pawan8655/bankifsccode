import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Building2,
  MapPin,
  Building,
  GitBranch,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SearchFilters({ data }) {
  const navigate = useNavigate();

  const [bank, setBank] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [branch, setBranch] = useState("");
  const [ifscSearch, setIfscSearch] = useState("");
  const [ifscResults, setIfscResults] = useState([]);

  /* ---------- Derived Data ---------- */

  const banks = useMemo(
    () => [...new Set(data.map((d) => d.Bank))].sort(),
    [data]
  );

  const states = useMemo(() => {
    if (!bank) return [];
    return [
      ...new Set(data.filter((d) => d.Bank === bank).map((d) => d.State)),
    ].sort();
  }, [bank, data]);

  const cities = useMemo(() => {
    if (!bank || !state) return [];
    return [
      ...new Set(
        data
          .filter((d) => d.Bank === bank && d.State === state)
          .map((d) => d.City)
      ),
    ].sort();
  }, [bank, state, data]);

  const branches = useMemo(() => {
    if (!bank || !state || !city) return [];
    return data
      .filter(
        (d) =>
          d.Bank === bank && d.State === state && d.City === city
      )
      .sort((a, b) => a.Branch.localeCompare(b.Branch));
  }, [bank, state, city, data]);

  /* ---------- IFSC Search ---------- */

  useEffect(() => {
    if (ifscSearch.length >= 3) {
      const results = data.filter((d) =>
        d.IFSC.toUpperCase().includes(ifscSearch)
      );
      setIfscResults(results.slice(0, 8));
    } else {
      setIfscResults([]);
    }
  }, [ifscSearch, data]);

  const handleSearch = () => {
    if (branch) {
      navigate(`/branch/${branch}`);
    } else if (city) {
      navigate(`/bank/${bank}/${state}/${city}`);
    } else if (state) {
      navigate(`/bank/${bank}/${state}`);
    } else if (bank) {
      navigate(`/bank/${bank}`);
    }
  };

  return (
    <Card className="bg-card/60 backdrop-blur-md border shadow-lg rounded-2xl">
      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* IFSC Direct Search */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Quick IFSC Search</span>
          </div>

          <Input
            placeholder="Enter IFSC (e.g. SBIN0000001)"
            value={ifscSearch}
            inputMode="text"
            autoCapitalize="characters"
            autoCorrect="off"
            maxLength={11}
            onChange={(e) =>
              setIfscSearch(e.target.value.toUpperCase())
            }
            className="font-mono h-12 text-base tracking-wider"
          />

          {ifscResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-background border rounded-xl shadow-xl max-h-72 overflow-y-auto">
              {ifscResults.map((item) => (
                <button
                  key={item.IFSC}
                  onClick={() => navigate(`/branch/${item.IFSC}`)}
                  className="w-full text-left px-4 py-4 hover:bg-primary/5 border-b last:border-0"
                >
                  <div className="font-mono font-semibold text-primary">
                    {item.IFSC}
                  </div>
                  <div className="text-sm">
                    {item.Bank} - {item.Branch}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs uppercase text-muted-foreground">
            Browse by Filters
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Cascading Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SelectBox
            label="Bank"
            icon={Building2}
            value={bank}
            onChange={(v) => {
              setBank(v);
              setState("");
              setCity("");
              setBranch("");
            }}
            options={banks}
          />

          <SelectBox
            label="State"
            icon={MapPin}
            value={state}
            onChange={(v) => {
              setState(v);
              setCity("");
              setBranch("");
            }}
            options={states}
            disabled={!bank}
          />

          <SelectBox
            label="City"
            icon={Building}
            value={city}
            onChange={(v) => {
              setCity(v);
              setBranch("");
            }}
            options={cities}
            disabled={!state}
          />

          <SelectBox
            label="Branch"
            icon={GitBranch}
            value={branch}
            onChange={setBranch}
            options={branches.map((b) => ({
              value: b.IFSC,
              label: b.Branch,
            }))}
            disabled={!city}
          />
        </div>

        {/* Sticky Mobile Button */}
        <div className="sticky bottom-0 pt-4 bg-background sm:static">
          <Button
            onClick={handleSearch}
            disabled={!bank}
            className="w-full h-12 text-base shadow-md"
          >
            <Search className="h-5 w-5 mr-2" />
            Search IFSC
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------- Reusable Select ---------- */

function SelectBox({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  disabled,
}) {
  const [open, setOpen] = useState(false);

  const items =
    options?.map((opt) =>
      typeof opt === "string"
        ? { value: opt, label: opt }
        : opt
    ) || [];

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4" />
        {label}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-12 text-base rounded-xl"
            disabled={disabled}
          >
            {value
              ? items.find((i) => i.value === value)?.label || value
              : `Select ${label}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl shadow-xl">
          <Command>
            <CommandInput placeholder={`Search ${label}...`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value
                          ? "opacity-100"
                          : "opacity-0"
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
