import { useMemo, useState, type FC } from "react";
import { ChevronDown, Search } from "lucide-react";
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
import { CITIES, type City } from "@/constants/cities";

export interface CityPickerProps {
  selectedCityId: string | null;
  onSelectCity: (cityId: string) => void;
  triggerId?: string;
  isError?: boolean;
}

const POPULAR_CITIES = CITIES.filter((c) => c.popular);
const ALL_CITIES_SORTED = [...CITIES].sort((a, b) =>
  a.name.localeCompare(b.name)
);

export const CityPicker: FC<CityPickerProps> = ({
  selectedCityId,
  onSelectCity,
  triggerId = "city-picker-trigger",
  isError = false,
}) => {
  const [open, setOpen] = useState(false);

  const selectedCity = useMemo(
    () => CITIES.find((c) => c.id === selectedCityId) ?? null,
    [selectedCityId]
  );

  const handleSelect = (city: City) => {
    onSelectCity(city.id);
    setOpen(false);
  };

  const renderItem = (city: City, prefix: string) => (
    <CommandItem
      key={`${prefix}-${city.id}`}
      value={`${city.name} ${city.state}`}
      onSelect={() => handleSelect(city)}
      className="city-picker-row flex cursor-pointer items-center justify-between px-3.5 py-2.5 text-sm"
    >
      <span className="font-semibold">{city.name}</span>
      <span className="text-xs text-ink-muted">{city.state}</span>
    </CommandItem>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={triggerId}
          aria-label="City"
          role="combobox"
          aria-expanded={open}
          className={`glass flex h-[54px] w-full cursor-pointer items-center justify-between rounded-full px-5 text-left text-sm transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-teal ${
            isError ? "border-amber/80 ring-1 ring-amber/80" : ""
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Search className="h-5 w-5 shrink-0 text-ink-muted" />
            {selectedCity ? (
              <span className="truncate">
                <span className="font-semibold text-ink">
                  {selectedCity.name}
                </span>
                <span className="ml-1.5 text-ink-muted">
                  {selectedCity.state}
                </span>
              </span>
            ) : (
              <span className="text-ink-muted">Search your city</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-ink-muted opacity-80" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="glass w-[--radix-popover-trigger-width] rounded-2xl border-white/15 p-2 text-ink shadow-2xl backdrop-blur-2xl"
      >
        <Command className="city-picker-input-wrapper bg-transparent text-ink">
          <CommandInput
            placeholder="Search your city..."
            className="text-sm text-ink placeholder:text-ink-muted"
          />

          <CommandList className="city-picker-scroll max-h-[260px] overflow-y-auto p-1.5">
            <CommandEmpty className="py-4 text-center text-sm text-ink-muted">
              No city found.
            </CommandEmpty>

            <CommandGroup
              heading="Popular"
              className="text-xs font-semibold text-ink-muted"
            >
              {POPULAR_CITIES.map((c) => renderItem(c, "popular"))}
            </CommandGroup>

            <CommandGroup
              heading="All covered cities"
              className="text-xs font-semibold text-ink-muted"
            >
              {ALL_CITIES_SORTED.map((c) => renderItem(c, "all"))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
