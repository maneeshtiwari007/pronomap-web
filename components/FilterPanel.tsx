import { useState, useEffect } from "react";
import { PropertyFilter } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filter: PropertyFilter) => void;
  filter: PropertyFilter;
}

export default function FilterPanel({ isOpen, onClose, onFilterChange, filter }: FilterPanelProps) {
  const isMobile = useIsMobile();
  
  // Local state for filter values
  const [locations, setLocations] = useState<string[]>(filter.location || []);
  const [propertyTypes, setPropertyTypes] = useState<string[]>(filter.propertyType || []);
  const [floor, setFloor] = useState<string>("Any Floor");
  const [budget, setBudget] = useState<number[]>([5000000]);
  const [builders, setBuilders] = useState<string[]>(filter.builder || []);
  const [possessionDate, setPossessionDate] = useState<string | undefined>(filter.possessionDate);
  
  // Search state for multiple selection options
  const [locationSearch, setLocationSearch] = useState("");
  const [builderSearch, setBuilderSearch] = useState("");
  const [propertyTypeSearch, setPropertyTypeSearch] = useState("");
  
  // Reset filters
  const handleReset = () => {
    // Reset all local state
    setLocations([]);
    setPropertyTypes([]);
    setFloor("Any Floor");
    setBudget([5000000]);
    setBuilders([]);
    setPossessionDate(undefined);
    
    // Reset search fields
    setLocationSearch("");
    setBuilderSearch("");
    setPropertyTypeSearch("");
    
    // Notify parent component about reset
    const resetFilter: PropertyFilter = {
      location: [],
      propertyType: [],
      minPrice: undefined, 
      maxPrice: undefined,
      builder: [],
      possessionDate: undefined
    };
    
    onFilterChange(resetFilter);
  };
  
  // Apply filters
  const handleApply = () => {
    onFilterChange({
      location: locations,
      propertyType: propertyTypes,
      floor: floor !== "Any Floor" ? extractFloorNumber(floor) : undefined,
      minPrice: Math.min(...budget),
      maxPrice: Math.max(...budget),
      builder: builders,
      possessionDate: possessionDate
    });
    
    if (isMobile) {
      onClose();
    }
  };
  
  // Helper function to extract floor number
  const extractFloorNumber = (floorString: string): number | undefined => {
    if (floorString === "Ground Floor") return 0;
    if (floorString === "1st - 3rd Floor") return 2; // Average
    if (floorString === "4th - 8th Floor") return 6; // Average
    if (floorString === "9th Floor and above") return 9;
    return undefined;
  };
  
  // Format budget for display
  const formatBudget = (value: number): string => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    } else {
      return `₹${(value / 100000).toFixed(0)} Lakh`;
    }
  };
  
  // Toggle location
  const toggleLocation = (location: string) => {
    if (locations.includes(location)) {
      setLocations(locations.filter(loc => loc !== location));
    } else {
      setLocations([...locations, location]);
    }
  };
  
  // Toggle property type
  const togglePropertyType = (type: string) => {
    if (propertyTypes.includes(type)) {
      setPropertyTypes(propertyTypes.filter(t => t !== type));
    } else {
      setPropertyTypes([...propertyTypes, type]);
    }
  };
  
  // Toggle builder
  const toggleBuilder = (builder: string) => {
    if (builders.includes(builder)) {
      setBuilders(builders.filter(b => b !== builder));
    } else {
      setBuilders([...builders, builder]);
    }
  };
  
  // Panel classes based on mobile/desktop and open state
  const panelClasses = `
    bg-white shadow-lg w-full md:w-72 overflow-y-auto z-10 
    ${isMobile ? 'absolute inset-0 md:relative transform transition-transform duration-300 ease-in-out' : ''}
    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
  `;

  return (
    <div className={panelClasses}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary">Filters</h3>
        {isMobile && (
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close filters">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        )}
      </div>
      
      <div className="p-4 space-y-6">
        <Accordion type="multiple" defaultValue={["location", "type", "budget"]}>
          {/* Filter: Location */}
          <AccordionItem value="location" className="border-b border-gray-200">
            <AccordionTrigger className="py-3 font-medium text-gray-800">
              Location
              {locations.length > 0 && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {locations.length}
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="relative mb-3">
                <Input
                  placeholder="Search locations..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="pl-8 text-sm"
                />
                <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {["Gomti Nagar", "Indira Nagar", "Hazratganj", "Aliganj", "Mahanagar"]
                  .filter(location => location.toLowerCase().includes(locationSearch.toLowerCase()))
                  .map((location) => (
                    <div key={location} className="flex items-center">
                      <Checkbox 
                        id={`location-${location}`} 
                        checked={locations.includes(location)}
                        onCheckedChange={() => toggleLocation(location)}
                        className="data-[state=checked]:bg-accent data-[state=checked]:text-primary"
                      />
                      <Label htmlFor={`location-${location}`} className="ml-2 text-gray-700">{location}</Label>
                    </div>
                  ))
                }
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filter: Property Type */}
          <AccordionItem value="type" className="border-b border-gray-200">
            <AccordionTrigger className="py-3 font-medium text-gray-800">
              Property Type
              {propertyTypes.length > 0 && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {propertyTypes.length}
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="relative mb-3">
                <Input
                  placeholder="Search property types..."
                  value={propertyTypeSearch}
                  onChange={(e) => setPropertyTypeSearch(e.target.value)}
                  className="pl-8 text-sm"
                />
                <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
              <div className="space-y-2">
                {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Villa", "Plot"]
                  .filter(type => type.toLowerCase().includes(propertyTypeSearch.toLowerCase()))
                  .map((type) => (
                    <div key={type} className="flex items-center">
                      <Checkbox 
                        id={`type-${type}`} 
                        checked={propertyTypes.includes(type)}
                        onCheckedChange={() => togglePropertyType(type)}
                        className="data-[state=checked]:bg-accent data-[state=checked]:text-primary"
                      />
                      <Label htmlFor={`type-${type}`} className="ml-2 text-gray-700">{type}</Label>
                    </div>
                  ))
                }
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filter: Budget Range */}
          <AccordionItem value="budget" className="border-b border-gray-200">
            <AccordionTrigger className="py-3 font-medium text-gray-800">
              Budget (in ₹)
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="space-y-4">
                <div>
                  <Slider
                    value={budget}
                    min={500000}
                    max={20000000}
                    step={100000}
                    onValueChange={setBudget}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600">5 Lakh</span>
                    <span className="text-sm text-gray-600" id="budget-value">{formatBudget(budget[0])}</span>
                    <span className="text-sm text-gray-600">2 Cr</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filter: Floor */}
          <AccordionItem value="floor" className="border-b border-gray-200">
            <AccordionTrigger className="py-3 font-medium text-gray-800">
              Floor
              {floor !== "Any Floor" && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">1</span>
              )}
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <Select value={floor} onValueChange={setFloor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any Floor">Any Floor</SelectItem>
                  <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                  <SelectItem value="1st - 3rd Floor">1st - 3rd Floor</SelectItem>
                  <SelectItem value="4th - 8th Floor">4th - 8th Floor</SelectItem>
                  <SelectItem value="9th Floor and above">9th Floor and above</SelectItem>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Filter: Builder */}
          <AccordionItem value="builder" className="border-b border-gray-200">
            <AccordionTrigger className="py-3 font-medium text-gray-800">
              Builder
              {builders.length > 0 && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {builders.length}
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <div className="relative mb-3">
                <Input
                  placeholder="Search builders..."
                  value={builderSearch}
                  onChange={(e) => setBuilderSearch(e.target.value)}
                  className="pl-8 text-sm"
                />
                <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {["Omaxe", "Shalimar", "Eldeco", "Ansal", "DLF", "Godrej", "Supertech"]
                  .filter(builder => builder.toLowerCase().includes(builderSearch.toLowerCase()))
                  .map((builder) => (
                    <div key={builder} className="flex items-center">
                      <Checkbox 
                        id={`builder-${builder}`} 
                        checked={builders.includes(builder)}
                        onCheckedChange={() => toggleBuilder(builder)}
                        className="data-[state=checked]:bg-accent data-[state=checked]:text-primary"
                      />
                      <Label htmlFor={`builder-${builder}`} className="ml-2 text-gray-700">{builder}</Label>
                    </div>
                  ))
                }
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Filter: Possession Date */}
          <AccordionItem value="possession" className="border-b border-gray-200">
            <AccordionTrigger className="py-3 font-medium text-gray-800">
              Possession Date
              {possessionDate && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">1</span>
              )}
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <RadioGroup 
                value={possessionDate} 
                onValueChange={setPossessionDate}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="Ready to Move" 
                    id="possession-ready" 
                    className="text-accent"
                  />
                  <Label htmlFor="possession-ready">Ready to Move</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="Within 3 Months" 
                    id="possession-3m"
                    className="text-accent"
                  />
                  <Label htmlFor="possession-3m">Within 3 Months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="Within 6 Months" 
                    id="possession-6m"
                    className="text-accent"
                  />
                  <Label htmlFor="possession-6m">Within 6 Months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="Within 1 Year" 
                    id="possession-1y"
                    className="text-accent"
                  />
                  <Label htmlFor="possession-1y">Within 1 Year</Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button 
            className="flex-1 bg-accent hover:bg-yellow-600 text-primary"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
