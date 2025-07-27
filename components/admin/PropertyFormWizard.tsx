import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPropertySchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import AdminDrawingTools, { PropertyShape } from "./AdminDrawingTools";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";

// Extended schema for the form with validations
const extendedPropertySchema:any = insertPropertySchema.extend({
  // Add more specific validations or transformations
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    }).min(1, "Price must be greater than 0")
  ),
  pricePerSqFt: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({
      required_error: "Price per sq.ft is required",
      invalid_type_error: "Price per sq.ft must be a number",
    }).min(1, "Price per sq.ft must be greater than 0")
  ),
  area: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({
      required_error: "Area is required",
      invalid_type_error: "Area must be a number",
    }).min(1, "Area must be greater than 0")
  ),
  bedrooms: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({
      required_error: "Number of bedrooms is required",
      invalid_type_error: "Number of bedrooms must be a number",
    }).min(0, "Number of bedrooms cannot be negative")
  ),
  bathrooms: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({
      required_error: "Number of bathrooms is required",
      invalid_type_error: "Number of bathrooms must be a number",
    }).min(0, "Number of bathrooms cannot be negative")
  ),
  floors: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({
      required_error: "Number of floors is required",
      invalid_type_error: "Number of floors must be a number",
    }).min(1, "Number of floors must be at least 1")
  ),
  latitude: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({
      required_error: "Latitude is required",
      invalid_type_error: "Latitude must be a number",
    }).min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90")
  ),
  longitude: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({
      required_error: "Longitude is required",
      invalid_type_error: "Longitude must be a number",
    }).min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180")
  ),
});

// Extract type from our extended schema
type PropertyFormValues = typeof extendedPropertySchema;

// Property types available for selection
const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Plot",
  "Shop",
  "Office",
  "Warehouse",
  "Industrial",
  "Agricultural"
];

// Property status options
const PROPERTY_STATUS = [
  "Under Construction",
  "Ready to Move",
  "Coming Soon"
];

// Common locations in Lucknow
const LOCATIONS = [
  "Gomti Nagar",
  "Indira Nagar",
  "Hazratganj",
  "Aliganj",
  "Mahanagar",
  "Jankipuram",
  "Sushant Golf City",
  "Chinhat",
  "Vibhuti Khand",
  "Aminabad"
];

// Common builders
const BUILDERS = [
  "Shalimar Corp",
  "Omaxe",
  "Ansal API",
  "DLF",
  "Eldeco",
  "Supertech",
  "Jaypee Group",
  "ATS",
  "Wave Infratech",
  "Purvanchal Group"
];

// Common amenities
const AMENITIES = [
  "Swimming Pool",
  "Gym",
  "Club House",
  "Children's Play Area",
  "Garden",
  "Power Backup",
  "Lift",
  "Security",
  "Car Parking",
  "Community Hall",
  "Sports Facility",
  "Jogging Track",
  "Temple",
  "Gated Community",
  "24x7 Water Supply",
  "Fire Safety",
  "Shopping Center",
  "Hospital",
  "School",
  "ATM"
];

// Property form wizard interface
interface PropertyFormWizardProps {
  initialValues?: Partial<PropertyFormValues>;
  onSubmit: (data: PropertyFormValues) => void;
  isSubmitting?: boolean;
}

export default function PropertyFormWizard({
  initialValues,
  onSubmit,
  isSubmitting = false
}: PropertyFormWizardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [formProgress, setFormProgress] = useState({
    basic: false,
    map: false,
    details: false,
    media: false,
    amenities: false,
    units: false,
    seo: false
  });
  const [drawnShapes, setDrawnShapes] = useState<PropertyShape[]>([]);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Create form with default values
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(extendedPropertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      pricePerSqFt: 0,
      propertyType: "",
      propertyStatus: "Under Construction",
      location: "",
      address: "",
      city: "Lucknow",
      area: 0,
      floors: 1,
      bedrooms: 0,
      bathrooms: 0,
      builder: "",
      possessionDate: "",
      latitude: 26.8467, // Default Lucknow coordinates
      longitude: 80.9462,
      featuredImage: "",
      images: [],
      amenities: [],
      isFeatured: false,
      isVerified: false,
      tags: [],
      createdAt: new Date().toISOString(),
      ...initialValues
    },
  });

  // Auto-save functionality
  useEffect(() => {
    // Clear previous timer if exists
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // Set new timer for auto-save
    const timer = setTimeout(() => {
      const formData = form.getValues();
      
      // Save to localStorage as draft
      localStorage.setItem('propertyFormDraft', JSON.stringify({
        data: formData,
        lastSaved: new Date().toISOString()
      }));
      
      toast({
        title: "Draft saved",
        description: "Your changes have been automatically saved as a draft",
        duration: 2000,
      });
    }, 60000); // Auto-save every 60 seconds

    setAutoSaveTimer(timer);

    // Clear timer on unmount
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [form, toast]);

  // Load draft from localStorage when component mounts
  useEffect(() => {
    const savedDraft = localStorage.getItem('propertyFormDraft');
    
    if (savedDraft && !initialValues) {
      try {
        const { data, lastSaved } = JSON.parse(savedDraft);
        
        // Ask user if they want to restore the draft
        if (confirm(`Would you like to restore your unsaved draft from ${new Date(lastSaved).toLocaleString()}?`)) {
          // Reset form with draft data
          form.reset(data);
          
          toast({
            title: "Draft restored",
            description: "Your previous draft has been restored",
          });
        } else {
          // Remove draft if user declines
          localStorage.removeItem('propertyFormDraft');
        }
      } catch (error) {
        console.error("Error parsing saved draft:", error);
      }
    }
  }, []);

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    // Add map shapes to data if available
    if (drawnShapes.length > 0) {
      data.mapShapes = drawnShapes;
    }
    
    // Clear draft after successful submission
    localStorage.removeItem('propertyFormDraft');
    
    // Call parent submit handler
    onSubmit(data);
  });

  // Update form values from map
  const handleCoordinateChange = (lat: number, lng: number) => {
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
  };

  // Update drawn shapes
  const handleShapesChange = (shapes: PropertyShape[]) => {
    setDrawnShapes(shapes);
  };

  // Validate current tab and move to next
  const goToNextTab = async () => {
    const currentTab = activeTab;
    
    // Define fields to validate based on current tab
    const tabValidationFields: Record<string, string[]> = {
      basic: ['title', 'price', 'pricePerSqFt', 'propertyType', 'propertyStatus', 'location', 'address', 'city'],
      map: ['latitude', 'longitude'],
      details: ['area', 'floors', 'bedrooms', 'bathrooms', 'description'],
      media: ['featuredImage'],
      amenities: [],
      units: [],
      seo: []
    };
    
    // Validate only fields in the current tab
    const fieldsToValidate = tabValidationFields[currentTab];
    const result = await form.trigger(fieldsToValidate as any);
    
    if (result) {
      // Mark current tab as completed
      setFormProgress({
        ...formProgress,
        [currentTab]: true
      });
      
      // Determine next tab
      const tabOrder = ["basic", "map", "details", "media", "amenities", "units", "seo"];
      const currentIndex = tabOrder.indexOf(currentTab);
      
      if (currentIndex < tabOrder.length - 1) {
        setActiveTab(tabOrder[currentIndex + 1]);
      }
    } else {
      // Show error toast
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before proceeding",
        variant: "destructive",
      });
    }
  };

  // Go to previous tab
  const goToPrevTab = () => {
    const tabOrder = ["basic", "map", "details", "media", "amenities", "units", "seo"];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  // Determine the progress percentage
  const getProgressPercentage = () => {
    const totalTabs = 7; // Total number of tabs
    const completedTabs = Object.values(formProgress).filter(Boolean).length;
    return Math.round((completedTabs / totalTabs) * 100);
  };

  // Render the form wizard
  return (
    <div className="mt-4">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Step {Object.keys(formProgress).indexOf(activeTab) + 1} of 7</span>
          <span>{getProgressPercentage()}% Complete</span>
        </div>
      </div>
      
      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-8">
          <TabsTrigger value="basic" className="relative">
            <span>Basic</span>
            {formProgress.basic && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="map" className="relative">
            <span>Map</span>
            {formProgress.map && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="details" className="relative">
            <span>Details</span>
            {formProgress.details && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="media" className="relative">
            <span>Media</span>
            {formProgress.media && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="amenities" className="relative">
            <span>Amenities</span>
            {formProgress.amenities && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="units" className="relative">
            <span>Units</span>
            {formProgress.units && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="seo" className="relative">
            <span>SEO</span>
            {formProgress.seo && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Green Valley Residency" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reraNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RERA Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., UPRERAPRJ12345" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormDescription>
                            Registration number with Real Estate Regulatory Authority
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="builder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Builder</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select builder" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BUILDERS.map((builder) => (
                                <SelectItem key={builder} value={builder}>
                                  {builder}
                                </SelectItem>
                              ))}
                              <SelectItem value="other">Other (Custom)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('builder') === 'other' && (
                      <FormField
                        control={form.control}
                        name="builder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Builder Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter builder name" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROPERTY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="propertyStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROPERTY_STATUS.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="possessionDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Possession Date *</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YYYY (e.g., 12/2025)" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="launchDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Launch Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YYYY (e.g., 06/2023)" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LOCATIONS.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                              <SelectItem value="other">Other (Custom)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('location') === 'other' && (
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter location" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Full property address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input defaultValue="Lucknow" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pin Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 226010" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="locality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Locality</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Sector 7" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nearby Landmark</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Next to City Mall" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₹) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 5000000" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>Enter price in rupees</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="pricePerSqFt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price per sq.ft (₹) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 5500" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="button" onClick={goToNextTab}>
                    Next: Map Configuration
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Map Configuration Tab */}
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Map Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Draw property boundaries and shapes on the map. You can add multiple shapes for complex properties.
                    </AlertDescription>
                  </Alert>
                  
                  <AdminDrawingTools 
                    onCoordinateChange={handleCoordinateChange}
                    onShapesChange={handleShapesChange}
                    initialShapes={drawnShapes}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.000001" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.000001" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next: Property Details
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Detailed Information Tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of the property" 
                            className="min-h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a comprehensive description highlighting key features and selling points
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area (sq.ft) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 1250" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="totalArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Project Area (acres)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="e.g., 5.5" 
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="facing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Facing</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select facing" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="North">North</SelectItem>
                              <SelectItem value="South">South</SelectItem>
                              <SelectItem value="East">East</SelectItem>
                              <SelectItem value="West">West</SelectItem>
                              <SelectItem value="North-East">North-East</SelectItem>
                              <SelectItem value="North-West">North-West</SelectItem>
                              <SelectItem value="South-East">South-East</SelectItem>
                              <SelectItem value="South-West">South-West</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="floors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Floors *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 15" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="totalTowers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Towers</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 4" 
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 3" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 2" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Premium, Gated Community, Riverside (comma-separated)" 
                            {...field}
                            onChange={(e) => {
                              // Convert comma-separated string to array
                              const tagsArray = e.target.value.split(',').map(tag => tag.trim());
                              field.onChange(tagsArray);
                            }}
                            value={field.value?.join(', ') || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Add tags to improve searchability (separate with commas)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Property</FormLabel>
                              <FormDescription>
                                Mark this property as featured to highlight it on the homepage
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="isVerified"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>RERA Verified</FormLabel>
                              <FormDescription>
                                Mark this property as verified if RERA registration is confirmed
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next: Media
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Media Tab */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle>Media & Gallery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL of the main image to display for this property
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Images</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg" 
                            value={field.value?.join(', ') || ''}
                            onChange={(e) => {
                              // Convert comma-separated string to array
                              const imagesArray = e.target.value.split(',').map(url => url.trim());
                              field.onChange(imagesArray);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter additional image URLs (comma-separated)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Builder/Project Logo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., https://example.com/logo.png" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="brochure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brochure URL</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., https://example.com/brochure.pdf" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormDescription>
                          URL to downloadable PDF brochure
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="videoLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Links</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., https://youtube.com/watch?v=abc123, https://vimeo.com/123456" 
                            value={field.value?.join(', ') || ''}
                            onChange={(e) => {
                              // Convert comma-separated string to array
                              const videoLinksArray = e.target.value.split(',').map(url => url.trim());
                              field.onChange(videoLinksArray);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter video links (YouTube, Vimeo, etc.), comma-separated
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="virtualTourLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Virtual Tour Link</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., https://example.com/tour" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormDescription>
                          URL to 360° virtual tour
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next: Amenities & Features
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Amenities Tab */}
            <TabsContent value="amenities">
              <Card>
                <CardHeader>
                  <CardTitle>Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="amenities"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Amenities</FormLabel>
                          <FormDescription>
                            Select all amenities available in this property
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {AMENITIES.map((amenity) => (
                            <FormField
                              key={amenity}
                              control={form.control}
                              name="amenities"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={amenity}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(amenity)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], amenity])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value:any) => value !== amenity
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {amenity}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Parking</h3>
                      <FormField
                        control={form.control}
                        name="features.parking.available"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Parking Available</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="features.parking.type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parking Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!form.watch('features.parking.available')}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Covered">Covered</SelectItem>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="Both">Both Covered & Open</SelectItem>
                                <SelectItem value="Underground">Underground</SelectItem>
                                <SelectItem value="Multi-level">Multi-level</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Power Backup</h3>
                      <FormField
                        control={form.control}
                        name="features.powerBackup.available"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Power Backup Available</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="features.powerBackup.type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Backup Type</FormLabel>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!form.watch('features.powerBackup.available')}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Full" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Full Backup
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Partial" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Partial Backup
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Common Areas" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Common Areas Only
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Security</h3>
                      <FormField
                        control={form.control}
                        name="features.security.available"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Security Available</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2 pl-7">
                        <FormField
                          control={form.control}
                          name="features.security.cctv"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!form.watch('features.security.available')}
                                />
                              </FormControl>
                              <FormLabel>CCTV Surveillance</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="features.security.guards"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!form.watch('features.security.available')}
                                />
                              </FormControl>
                              <FormLabel>Security Guards</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="features.security.intercom"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!form.watch('features.security.available')}
                                />
                              </FormControl>
                              <FormLabel>Intercom</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Water Supply</h3>
                      <FormField
                        control={form.control}
                        name="features.waterSupply.type"
                        render={({ field }) => (
                          <FormItem>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="24x7" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  24x7 Water Supply
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Municipal" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Municipal Connection
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Borewell" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Borewell
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Tanker" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Water Tanker Supply
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Other Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="features.lift"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Lift/Elevator</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="features.clubhouse"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Clubhouse</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="features.swimmingPool"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Swimming Pool</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="features.fireSafety"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Fire Safety</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="features.garden"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Garden</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="features.rainwaterHarvesting"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Rainwater Harvesting</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next: Unit Inventory
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Unit Inventory Tab */}
            <TabsContent value="units">
              <Card>
                <CardHeader>
                  <CardTitle>Unit Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This section allows you to add specific unit information for apartments, villas, or shops in the project.
                      For projects with many units, consider using the Excel bulk import feature.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="unitInventory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Inventory JSON</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder='[{"unitNumber": "A-101", "type": "2 BHK", "area": 1250, "price": 5000000, "status": "Available"}]'
                              className="font-mono text-sm h-32"
                              value={field.value ? JSON.stringify(field.value, null, 2) : '[]'} 
                              onChange={(e) => {
                                try {
                                  const value = e.target.value ? JSON.parse(e.target.value) : [];
                                  field.onChange(value);
                                } catch (error) {
                                  // Don't update on invalid JSON
                                  console.error("Invalid JSON format", error);
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter unit details in JSON format. For complex inventories, use the Excel import feature.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Simple unit entry UI could go here */}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next: SEO & Metadata
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* SEO Tab */}
            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seoMetadata.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Luxury Apartments in Gomti Nagar | Green Valley Residency" {...field} />
                        </FormControl>
                        <FormDescription>
                          Title tag for search engines (recommended: 50-60 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seoMetadata.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Discover luxury apartments in Gomti Nagar with modern amenities and great connectivity. Premium 2-3 BHK starting at ₹50 Lakhs." 
                            className="h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Meta description for search engines (recommended: 150-160 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seoMetadata.keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Keywords</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Lucknow property, Gomti Nagar apartments, 3 BHK flats" {...field} />
                        </FormControl>
                        <FormDescription>
                          Comma-separated keywords (less important for modern SEO)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seoMetadata.canonicalUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Canonical URL</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., https://lucknowproperty.com/properties/green-valley-residency" {...field} />
                        </FormControl>
                        <FormDescription>
                          Canonical URL for pages with duplicate content
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seoMetadata.schema"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>JSON-LD Schema Markup</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder='{"@context": "https://schema.org", "@type": "Residence", "name": "Green Valley Residency"...}'
                            className="font-mono text-sm h-32"
                            value={field.value ? (typeof field.value === 'string' ? field.value : JSON.stringify(field.value, null, 2)) : ''} 
                            onChange={(e) => {
                              try {
                                // Try to parse as JSON if it's valid
                                const value = e.target.value ? JSON.parse(e.target.value) : null;
                                field.onChange(value);
                              } catch (error) {
                                // Otherwise store as string
                                field.onChange(e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Structured data for search engines (JSON-LD format)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  
                  <div className="space-x-3">
                    <Button type="button" variant="outline">
                      Save as Draft
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Create Property
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}