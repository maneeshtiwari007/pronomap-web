import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { InsertProperty } from "@shared/schema";
import { Check, Info, Upload, AlertCircle, Download, AlertTriangle, X } from "lucide-react";

interface BulkImportToolProps {
  onImport: (properties: Partial<InsertProperty>[]) => void;
  isLoading?: boolean;
}

interface ImportProgress {
  total: number;
  valid: number;
  invalid: number;
  processed: number;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

// Define expected template columns
const EXPECTED_HEADERS = [
  'title',
  'propertyType',
  'propertyStatus',
  'price',
  'pricePerSqFt',
  'location',
  'address',
  'city',
  'latitude',
  'longitude',
  'area',
  'bedrooms',
  'bathrooms',
  'builder',
  'reraNumber',
  'possessionDate'
];

// Define optional columns
const OPTIONAL_HEADERS = [
  'description',
  'locality',
  'landmark',
  'facing',
  'totalArea',
  'floors',
  'totalTowers',
  'launchDate',
  'featuredImage',
  'logo',
  'brochure',
  'virtualTourLink',
  'amenities',
  'features',
  'seoMetadata',
  'tags'
];

// Column names with their display names and descriptions for the template
const COLUMN_INFO = {
  title: { name: 'Title', description: 'Name of the property project', required: true },
  propertyType: { name: 'Property Type', description: 'Type of property (Apartment, Villa, Plot, etc.)', required: true },
  propertyStatus: { name: 'Status', description: 'Current status (Under Construction, Ready to Move, Coming Soon)', required: true },
  price: { name: 'Price (₹)', description: 'Base price in rupees', required: true },
  pricePerSqFt: { name: 'Price/SqFt (₹)', description: 'Price per square foot', required: true },
  location: { name: 'Location', description: 'Primary location/area', required: true },
  address: { name: 'Address', description: 'Complete address', required: true },
  city: { name: 'City', description: 'City name (default: Lucknow)', required: false },
  latitude: { name: 'Latitude', description: 'Geographic latitude coordinate', required: true },
  longitude: { name: 'Longitude', description: 'Geographic longitude coordinate', required: true },
  area: { name: 'Area (sq.ft)', description: 'Built-up area in square feet', required: true },
  bedrooms: { name: 'Bedrooms', description: 'Number of bedrooms', required: true },
  bathrooms: { name: 'Bathrooms', description: 'Number of bathrooms', required: true },
  builder: { name: 'Builder', description: 'Builder/developer name', required: false },
  reraNumber: { name: 'RERA Number', description: 'RERA registration number', required: false },
  possessionDate: { name: 'Possession Date', description: 'Expected possession date (MM/YYYY)', required: true },
  description: { name: 'Description', description: 'Detailed property description', required: false },
  locality: { name: 'Locality', description: 'Specific locality within location', required: false },
  landmark: { name: 'Landmark', description: 'Nearby landmark', required: false },
  facing: { name: 'Facing', description: 'Property facing direction (N, S, E, W, NE, etc.)', required: false },
  totalArea: { name: 'Total Area (acres)', description: 'Total project area in acres', required: false },
  floors: { name: 'Floors', description: 'Number of floors', required: false },
  totalTowers: { name: 'Total Towers', description: 'Number of towers in the project', required: false },
  launchDate: { name: 'Launch Date', description: 'Project launch date (MM/YYYY)', required: false },
  featuredImage: { name: 'Featured Image URL', description: 'URL to featured image', required: false },
  logo: { name: 'Logo URL', description: 'URL to builder/project logo', required: false },
  brochure: { name: 'Brochure URL', description: 'URL to downloadable brochure', required: false },
  virtualTourLink: { name: 'Virtual Tour URL', description: 'URL to virtual tour', required: false },
  amenities: { name: 'Amenities', description: 'Comma-separated list of amenities', required: false },
  features: { name: 'Features', description: 'JSON string of features', required: false },
  seoMetadata: { name: 'SEO Metadata', description: 'JSON string of SEO metadata', required: false },
  tags: { name: 'Tags', description: 'Comma-separated list of tags', required: false }
};

export default function BulkImportTool({ onImport, isLoading = false }: BulkImportToolProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [step, setStep] = useState<'upload' | 'validate' | 'preview' | 'complete'>('upload');
  const [properties, setProperties] = useState<Partial<InsertProperty>[]>([]);
  const [progress, setProgress] = useState<ImportProgress>({ total: 0, valid: 0, invalid: 0, processed: 0 });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'errors' | 'template'>('preview');

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      
      // Validate file type
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls') && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: "Invalid file format",
          description: "Please upload an Excel (.xlsx, .xls) or CSV file",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  // Reset the import process
  const resetImport = () => {
    setFile(null);
    setStep('upload');
    setProperties([]);
    setProgress({ total: 0, valid: 0, invalid: 0, processed: 0 });
    setErrors([]);
    setActiveTab('preview');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Read and parse the Excel file
  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  // Validate a row of property data
  const validatePropertyRow = (row: any, index: number): { isValid: boolean; property: Partial<InsertProperty>; errors: ValidationError[] } => {
    const errors: ValidationError[] = [];
    const property: any = {} //Partial<InsertProperty> = {};
    
    // Check required fields are present
    for (const header of EXPECTED_HEADERS) {
      const columnInfo = COLUMN_INFO[header as keyof typeof COLUMN_INFO];
      
      if (columnInfo.required && (!row[header] || row[header].toString().trim() === '')) {
        errors.push({
          row: index + 1,
          field: header,
          message: `Required field '${columnInfo.name}' is missing`
        });
      }
      
      // Add to property object
      if (row[header] !== undefined) {
        // Handle numeric fields
        if (header === 'price' || header === 'pricePerSqFt' || header === 'area' || 
            header === 'bedrooms' || header === 'bathrooms' || header === 'floors' || 
            header === 'totalTowers' || header === 'totalArea') {
          // Convert to number and use type assertion to let TypeScript know 
          // this is a valid operation on a partial object
          (property as any)[header] = Number(row[header]);
          
          // Validate number fields
          if (isNaN(Number(row[header]))) {
            errors.push({
              row: index + 1,
              field: header,
              message: `'${columnInfo.name}' must be a number`
            });
          }
        } 
        // Handle latitude and longitude
        else if (header === 'latitude' || header === 'longitude') {
          // Convert to number and use type assertion
          (property as any)[header] = Number(row[header]);
          
          // Validate latitude and longitude
          if (isNaN(Number(row[header]))) {
            errors.push({
              row: index + 1,
              field: header,
              message: `'${columnInfo.name}' must be a valid coordinate number`
            });
          }
        }
        // Handle string fields
        else {
          property[header as keyof InsertProperty] = row[header];
        }
      }
    }
    
    // Handle optional fields
    for (const header of OPTIONAL_HEADERS) {
      if (row[header] !== undefined && row[header] !== '') {
        // Handle array fields
        if (header === 'amenities' || header === 'tags') {
          try {
            // Convert comma-separated string to array
            property[header as keyof InsertProperty] = row[header].split(',').map((item: string) => item.trim());
          } catch (e) {
            errors.push({
              row: index + 1,
              field: header,
              message: `Invalid format for '${header}'. Use comma-separated values.`
            });
          }
        }
        // Handle JSON fields
        else if (header === 'features' || header === 'seoMetadata') {
          try {
            // Parse JSON string to object
            property[header as keyof InsertProperty] = JSON.parse(row[header]);
          } catch (e) {
            errors.push({
              row: index + 1,
              field: header,
              message: `Invalid JSON format for '${header}'`
            });
          }
        }
        // Handle other fields
        else {
          property[header as keyof InsertProperty] = row[header];
        }
      }
    }
    
    // Add default created at date
    property.createdAt = new Date().toISOString();
    
    // Set default empty arrays for required array fields
    if (!property.images) property.images = [];
    
    return {
      isValid: errors.length === 0,
      property,
      errors
    };
  };

  // Process the uploaded file
  const processFile = async () => {
    if (!file) return;
    
    setStep('validate');
    setIsValidating(true);
    
    try {
      const rows = await readExcelFile(file);
      const total = rows.length;
      setProgress({ total, valid: 0, invalid: 0, processed: 0 });
      
      const validatedProperties: Partial<InsertProperty>[] = [];
      const allErrors: ValidationError[] = [];
      
      // Process rows with artificial delay for progress display
      for (let i = 0; i < rows.length; i++) {
        const { isValid, property, errors } = validatePropertyRow(rows[i], i);
        
        if (isValid) {
          validatedProperties.push(property);
          setProgress(prev => ({ ...prev, valid: prev.valid + 1, processed: prev.processed + 1 }));
        } else {
          allErrors.push(...errors);
          setProgress(prev => ({ ...prev, invalid: prev.invalid + 1, processed: prev.processed + 1 }));
        }
        
        // Add a small delay to show progress
        if (i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
      setProperties(validatedProperties);
      setErrors(allErrors);
      
      if (allErrors.length === 0) {
        setStep('preview');
        setActiveTab('preview');
        toast({
          title: "Validation successful",
          description: `${validatedProperties.length} properties are ready to import`,
        });
      } else {
        setStep('preview');
        setActiveTab('errors');
        toast({
          title: "Validation issues found",
          description: `Found ${allErrors.length} issues in ${progress.invalid} rows`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: "There was an error reading the file. Please check the format and try again.",
        variant: "destructive",
      });
      resetImport();
    } finally {
      setIsValidating(false);
    }
  };

  // Handle import button click
  const handleImport = () => {
    if (properties.length === 0) {
      toast({
        title: "No valid properties",
        description: "There are no valid properties to import",
        variant: "destructive",
      });
      return;
    }
    
    onImport(properties);
    setStep('complete');
  };

  // Generate template download
  const generateTemplate = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create data for the template
    const templateData = [
      // Header row
      Object.keys(COLUMN_INFO).map(key => COLUMN_INFO[key as keyof typeof COLUMN_INFO].name),
      // Required/optional row
      Object.keys(COLUMN_INFO).map(key => COLUMN_INFO[key as keyof typeof COLUMN_INFO].required ? 'Required' : 'Optional'),
      // Description row
      Object.keys(COLUMN_INFO).map(key => COLUMN_INFO[key as keyof typeof COLUMN_INFO].description),
      // Example row
      [
        'Green Valley Residency',            // title
        'Apartment',                         // propertyType
        'Under Construction',                // propertyStatus
        '5000000',                           // price
        '5500',                              // pricePerSqFt
        'Gomti Nagar',                       // location
        '123 Green Valley, Sector 7',        // address
        'Lucknow',                           // city
        '26.8467',                           // latitude
        '80.9462',                           // longitude
        '1250',                              // area
        '3',                                 // bedrooms
        '2',                                 // bathrooms
        'Excellence Builders',               // builder
        'UPRERAPRJ12345',                    // reraNumber
        '12/2025',                           // possessionDate
        'Luxury apartment with modern amenities and great connectivity', // description
        'Sector 7',                          // locality
        'Near City Mall',                    // landmark
        'E',                                 // facing
        '5.5',                               // totalArea
        '15',                                // floors
        '4',                                 // totalTowers
        '06/2023',                           // launchDate
        'https://example.com/image.jpg',     // featuredImage
        'https://example.com/logo.png',      // logo
        'https://example.com/brochure.pdf',  // brochure
        'https://example.com/tour',          // virtualTourLink
        'Pool, Gym, Garden, Parking',        // amenities
        '{"parking": true, "security": true}', // features
        '{"title": "Green Valley Apartments"}', // seoMetadata
        'Premium, Gated Community, Riverside' // tags
      ]
    ];
    
    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Property Template');
    
    // Generate Excel file
    XLSX.writeFile(wb, 'property_import_template.xlsx');
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Tabs value={step === 'preview' ? activeTab : undefined} onValueChange={(value) => setActiveTab(value as any)}>
        {/* Upload Step */}
        {step === 'upload' && (
          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Import Properties</h2>
              <p className="text-gray-600">
                Upload an Excel file (.xlsx, .xls) or CSV file with property details for bulk import.
              </p>
            </div>
            
            <div className="mb-6">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                />
                
                <div className="mb-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                </div>
                
                {file ? (
                  <div className="space-y-2">
                    <Badge variant="outline" className="py-1 px-3 bg-primary/10">
                      {file.name}
                    </Badge>
                    <p className="text-sm text-gray-500">
                      File size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-base font-medium text-gray-700 mb-1">
                      Click to select or drag & drop
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports Excel (.xlsx, .xls) and CSV files
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={generateTemplate}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              
              <Button 
                onClick={processFile} 
                disabled={!file}
                className="flex items-center"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload & Validate
              </Button>
            </div>
          </div>
        )}
        
        {/* Validation Step */}
        {step === 'validate' && (
          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Validating File</h2>
              <p className="text-gray-600">
                Please wait while we validate your property data...
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Validating rows...</span>
                <span>{progress.processed} of {progress.total}</span>
              </div>
              
              <Progress value={(progress.processed / progress.total) * 100} />
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                  <span>Valid: {progress.valid}</span>
                </div>
                
                <div className="flex items-center">
                  <X className="h-4 w-4 text-red-500 mr-1" />
                  <span>Invalid: {progress.invalid}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Preview Step */}
        {step === 'preview' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Import Preview</CardTitle>
                    <CardDescription>
                      {errors.length > 0 
                        ? `Found ${errors.length} validation issues. ${properties.length} properties are ready to import.`
                        : `${properties.length} properties are ready to import.`}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                      <span>{progress.valid} Valid</span>
                    </div>
                    
                    {progress.invalid > 0 && (
                      <div className="flex items-center text-sm">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                        <span>{progress.invalid} Invalid</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <TabsList className="mb-4">
                  <TabsTrigger value="preview" disabled={properties.length === 0}>
                    Preview Data
                  </TabsTrigger>
                  <TabsTrigger value="errors" disabled={errors.length === 0}>
                    Validation Issues {errors.length > 0 && `(${errors.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="template">
                    Template Info
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="rounded-md">
                  {properties.length > 0 ? (
                    <div className="border rounded-md overflow-x-auto max-h-96">
                      <Table>
                        <TableHeader className="bg-gray-50 sticky top-0">
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Area</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {properties.map((property:any, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell>{property?.title}</TableCell>
                              <TableCell>{property.propertyType}</TableCell>
                              <TableCell>{property.location}</TableCell>
                              <TableCell>{property.propertyStatus}</TableCell>
                              <TableCell>₹{Number(property.price).toLocaleString()}</TableCell>
                              <TableCell>{property.area} sq.ft</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No valid properties found in the file.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="errors">
                  {errors.length > 0 ? (
                    <div className="border rounded-md overflow-x-auto max-h-96">
                      <Table>
                        <TableHeader className="bg-gray-50 sticky top-0">
                          <TableRow>
                            <TableHead className="w-16">Row</TableHead>
                            <TableHead className="w-32">Field</TableHead>
                            <TableHead>Issue</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {errors.map((error, index) => (
                            <TableRow key={index}>
                              <TableCell>{error.row}</TableCell>
                              <TableCell>{error.field}</TableCell>
                              <TableCell>{error.message}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle>No Validation Issues</AlertTitle>
                      <AlertDescription>
                        All rows in the file passed validation.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
                
                <TabsContent value="template">
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      The template contains all required and optional fields needed for property import.
                      Download the template to see the expected format and examples.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="border rounded-md overflow-x-auto max-h-96">
                    <Table>
                      <TableHeader className="bg-gray-50 sticky top-0">
                        <TableRow>
                          <TableHead className="w-48">Field</TableHead>
                          <TableHead className="w-24">Required</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.keys(COLUMN_INFO).map((key) => {
                          const info = COLUMN_INFO[key as keyof typeof COLUMN_INFO];
                          return (
                            <TableRow key={key}>
                              <TableCell className="font-medium">{info.name}</TableCell>
                              <TableCell>
                                {info.required ? (
                                  <Badge variant="default" className="bg-primary">Yes</Badge>
                                ) : (
                                  <Badge variant="outline">No</Badge>
                                )}
                              </TableCell>
                              <TableCell>{info.description}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetImport}>
                  Cancel
                </Button>
                
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={generateTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                  
                  <Button 
                    onClick={handleImport} 
                    disabled={properties.length === 0 || isLoading}
                    className="flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Importing...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Import Properties
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {/* Complete Step */}
        {step === 'complete' && (
          <div className="bg-white rounded-lg p-8 border shadow-sm text-center">
            <div className="mb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Import Complete</h2>
            <p className="text-gray-600 mb-6">
              {properties.length} properties have been submitted for import.
            </p>
            
            <Button onClick={resetImport}>
              Import More Properties
            </Button>
          </div>
        )}
      </Tabs>
    </div>
  );
}