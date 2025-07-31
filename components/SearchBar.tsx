'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { MobileFilterDrawer } from "./FilterMobileDrawer";

interface SearchBarProps {
  onSearch?: (filter: any) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [location, setLocation] = useState<string>("Lucknow, Uttar Pradesh");
  const [propertyType, setPropertyType] = useState<string>("All Types");
  const [budget, setBudget] = useState<string>("Any Budget");
  const [budgetRange, setBudgetRange] = useState<number[]>([0]);
  const [keywords, setKeywords] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [showLocationPopover, setShowLocationPopover] = useState(true);
  const router = useRouter();
  const [isOpen,setIsOpen] = useState(false);

  // Handle search submission
  const handleSearch = () => {
    console.log('Close')
    const filter: any = {
      location: location !== "Lucknow, Uttar Pradesh" ? [location] : [],
      propertyType: propertyType !== "All Types" ? [propertyType] : [],
      minPrice: budget !== "Any Budget" ? getBudgetMinValue(budget) : undefined,
      maxPrice: budget !== "Any Budget" ? getBudgetMaxValue(budget) : undefined,
      keywords: keywords || undefined,
      pincode: pincode || undefined
    };
    const cleanedFilter = Object.fromEntries(
      Object.entries(filter).filter(
        ([_, value]) =>
          value !== undefined &&
          !(Array.isArray(value) && value.length === 0)
      )
    );
    const queryString = new URLSearchParams(cleanedFilter as any).toString();
    router.push('/search?' + queryString)
    //onSearch?.(filter);
  };

  // Helper function to parse budget ranges
  const getBudgetMinValue = (budgetString: string): number | undefined => {
    if (budgetString === "Under ₹25 Lakh") return 0;
    if (budgetString === "₹25 Lakh - ₹50 Lakh") return 2500000;
    if (budgetString === "₹50 Lakh - ₹1 Cr") return 5000000;
    if (budgetString === "₹1 Cr - ₹2 Cr") return 10000000;
    if (budgetString === "Above ₹2 Cr") return 20000000;
    return undefined;
  };

  const getBudgetMaxValue = (budgetString: string): number | undefined => {
    if (budgetString === "Under ₹25 Lakh") return 2500000;
    if (budgetString === "₹25 Lakh - ₹50 Lakh") return 5000000;
    if (budgetString === "₹50 Lakh - ₹1 Cr") return 10000000;
    if (budgetString === "₹1 Cr - ₹2 Cr") return 20000000;
    return undefined;
  };

  // Format budget value for display
  const formatBudgetValue = (value: number): string => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    } else {
      return `₹${(value / 100000).toFixed(0)} Lakh`;
    }
  };

  return (
    <div className="bg-primary py-4">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="md:hidden">
            <MobileFilterDrawer isOpenDialog={isOpen} onClickCallBack={()=>{handleSearch()}}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="col-span-1 lg:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Location</label>
                  <div className="relative flex items-center gap-2">
                    <Select defaultValue={location} onValueChange={setLocation}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lucknow, Uttar Pradesh">Lucknow, Uttar Pradesh</SelectItem>
                        <SelectItem value="Gomti Nagar">Gomti Nagar</SelectItem>
                        <SelectItem value="Indira Nagar">Indira Nagar</SelectItem>
                        <SelectItem value="Hazratganj">Hazratganj</SelectItem>
                        <SelectItem value="Aliganj">Aliganj</SelectItem>
                      </SelectContent>
                    </Select>
                    <Popover open={showLocationPopover} onOpenChange={setShowLocationPopover}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="ml-2 px-3 py-2 flex items-center justify-center"
                          title="Use my location"
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  setLocation('Current Location');
                                  setShowLocationPopover(false);
                                },
                                (error) => {
                                  alert('Unable to retrieve your location.');
                                }
                              );
                            } else {
                              alert('Geolocation is not supported by your browser.');
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464" />
                            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="center" side="top" className="z-50 w-64 text-center text-sm font-medium flex items-center justify-between gap-2">
                        <span>Enable location for better experience.</span>
                        <button onClick={() => setShowLocationPopover(false)} className="ml-2 p-1 rounded hover:bg-gray-100">
                          <X className="w-4 h-4" />
                        </button>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="col-span-1 lg:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Property Type</label>
                  <div className="relative">
                    <Select defaultValue={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Types">All Types</SelectItem>
                        <SelectItem value="1 BHK">1 BHK</SelectItem>
                        <SelectItem value="2 BHK">2 BHK</SelectItem>
                        <SelectItem value="3 BHK">3 BHK</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Plot">Plot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="col-span-1 lg:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Budget</label>
                  <div className="relative">
                    <Select defaultValue={budget} onValueChange={setBudget}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any Budget">Any Budget</SelectItem>
                        <SelectItem value="Under ₹25 Lakh">Under ₹25 Lakh</SelectItem>
                        <SelectItem value="₹25 Lakh - ₹50 Lakh">₹25 Lakh - ₹50 Lakh</SelectItem>
                        <SelectItem value="₹50 Lakh - ₹1 Cr">₹50 Lakh - ₹1 Cr</SelectItem>
                        <SelectItem value="₹1 Cr - ₹2 Cr">₹1 Cr - ₹2 Cr</SelectItem>
                        <SelectItem value="Above ₹2 Cr">Above ₹2 Cr</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="col-span-1 lg:col-span-1">
                  <label className="block text-gray-700 text-sm font-medium mb-1">More Filters</label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4"
                        >
                          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                        </svg>
                        Filters
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Advanced Filters</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Keywords</label>
                          <Input
                            placeholder="Search by keywords"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Budget Range</label>
                          <div className="px-1">
                            <Slider
                              defaultValue={[5000000]}
                              max={20000000}
                              step={100000}
                              onValueChange={setBudgetRange}
                            />
                            <div className="flex justify-between mt-2">
                              <span className="text-sm text-gray-600">5 Lakh</span>
                              <span className="text-sm text-gray-600">{formatBudgetValue(budgetRange[0])}</span>
                              <span className="text-sm text-gray-600">2 Cr</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Builder</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select builder" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="omaxe">Omaxe</SelectItem>
                              <SelectItem value="shalimar">Shalimar</SelectItem>
                              <SelectItem value="eldeco">Eldeco</SelectItem>
                              <SelectItem value="ansal">Ansal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Possession Date</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select possession date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ready">Ready to Move</SelectItem>
                              <SelectItem value="3months">Within 3 Months</SelectItem>
                              <SelectItem value="6months">Within 6 Months</SelectItem>
                              <SelectItem value="1year">Within 1 Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Pincode</label>
                          <Input
                            placeholder="Search by pincode (e.g. 226010)"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </MobileFilterDrawer>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="col-span-1 lg:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">Location</label>
                <div className="relative flex items-center gap-2">
                  <Select defaultValue={location} onValueChange={setLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lucknow, Uttar Pradesh">Lucknow, Uttar Pradesh</SelectItem>
                      <SelectItem value="Gomti Nagar">Gomti Nagar</SelectItem>
                      <SelectItem value="Indira Nagar">Indira Nagar</SelectItem>
                      <SelectItem value="Hazratganj">Hazratganj</SelectItem>
                      <SelectItem value="Aliganj">Aliganj</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover open={showLocationPopover} onOpenChange={setShowLocationPopover}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="ml-2 px-3 py-2 flex items-center justify-center"
                        title="Use my location"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                setLocation('Current Location');
                                setShowLocationPopover(false);
                              },
                              (error) => {
                                alert('Unable to retrieve your location.');
                              }
                            );
                          } else {
                            alert('Geolocation is not supported by your browser.');
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464" />
                          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="center" side="top" className="z-50 w-64 text-center text-sm font-medium flex items-center justify-between gap-2">
                      <span>Enable location for better experience.</span>
                      <button onClick={() => setShowLocationPopover(false)} className="ml-2 p-1 rounded hover:bg-gray-100">
                        <X className="w-4 h-4" />
                      </button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="col-span-1 lg:col-span-1">
                <label className="block text-gray-700 text-sm font-medium mb-1">Property Type</label>
                <div className="relative">
                  <Select defaultValue={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Types">All Types</SelectItem>
                      <SelectItem value="1 BHK">1 BHK</SelectItem>
                      <SelectItem value="2 BHK">2 BHK</SelectItem>
                      <SelectItem value="3 BHK">3 BHK</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Plot">Plot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="col-span-1 lg:col-span-1">
                <label className="block text-gray-700 text-sm font-medium mb-1">Budget</label>
                <div className="relative">
                  <Select defaultValue={budget} onValueChange={setBudget}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any Budget">Any Budget</SelectItem>
                      <SelectItem value="Under ₹25 Lakh">Under ₹25 Lakh</SelectItem>
                      <SelectItem value="₹25 Lakh - ₹50 Lakh">₹25 Lakh - ₹50 Lakh</SelectItem>
                      <SelectItem value="₹50 Lakh - ₹1 Cr">₹50 Lakh - ₹1 Cr</SelectItem>
                      <SelectItem value="₹1 Cr - ₹2 Cr">₹1 Cr - ₹2 Cr</SelectItem>
                      <SelectItem value="Above ₹2 Cr">Above ₹2 Cr</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="col-span-1 lg:col-span-1">
                <label className="block text-gray-700 text-sm font-medium mb-1">More Filters</label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                      </svg>
                      Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Advanced Filters</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Keywords</label>
                        <Input
                          placeholder="Search by keywords"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Budget Range</label>
                        <div className="px-1">
                          <Slider
                            defaultValue={[5000000]}
                            max={20000000}
                            step={100000}
                            onValueChange={setBudgetRange}
                          />
                          <div className="flex justify-between mt-2">
                            <span className="text-sm text-gray-600">5 Lakh</span>
                            <span className="text-sm text-gray-600">{formatBudgetValue(budgetRange[0])}</span>
                            <span className="text-sm text-gray-600">2 Cr</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Builder</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select builder" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="omaxe">Omaxe</SelectItem>
                            <SelectItem value="shalimar">Shalimar</SelectItem>
                            <SelectItem value="eldeco">Eldeco</SelectItem>
                            <SelectItem value="ansal">Ansal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Possession Date</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select possession date" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ready">Ready to Move</SelectItem>
                            <SelectItem value="3months">Within 3 Months</SelectItem>
                            <SelectItem value="6months">Within 6 Months</SelectItem>
                            <SelectItem value="1year">Within 1 Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Pincode</label>
                        <Input
                          placeholder="Search by pincode (e.g. 226010)"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="col-span-1 lg:col-span-1">
                <label className="block text-gray-700 text-sm font-medium mb-1 opacity-0">Search</label>
                <Button
                  className="w-full bg-accent hover:bg-yellow-600 text-primary font-medium transition-colors"
                  onClick={handleSearch}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
