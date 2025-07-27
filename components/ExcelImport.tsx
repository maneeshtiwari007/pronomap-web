import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { InsertProperty } from "@shared/schema";
import * as XLSX from 'xlsx';

interface ExcelImportProps {
  onImport: (properties: Partial<InsertProperty>[]) => void;
  isLoading?: boolean;
}

interface ImportProgress {
  total: number;
  valid: number;
  invalid: number;
}

export default function ExcelImport({ onImport, isLoading = false }: ExcelImportProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedData, setImportedData] = useState<Partial<InsertProperty>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [sampleVisible, setSampleVisible] = useState(false);
  
  // Required columns for property import
  const requiredColumns = [
    'title', 'description', 'price', 'propertyType', 'location', 'address', 
    'area', 'latitude', 'longitude'
  ];
  
  // Optional columns
  const optionalColumns = [
    'builder', 'possessionDate', 'bedrooms', 'bathrooms', 'floors', 
    'pricePerSqFt', 'amenities', 'isFeatured', 'isVerified', 'tags',
    'featuredImage', 'images'
  ];
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Reset state
      setImportedData([]);
      setErrors([]);
      setProgress(null);
      
      // Read the Excel file
      const data = await readExcelFile(file);
      
      // Validate the data
      const { validProperties, invalidReasons } = validateProperties(data);
      
      // Update state
      setImportedData(validProperties);
      setErrors(invalidReasons);
      setProgress({
        total: data.length,
        valid: validProperties.length,
        invalid: data.length - validProperties.length
      });
      
      if (validProperties.length > 0) {
        toast({
          title: "File Imported",
          description: `Found ${validProperties.length} valid properties out of ${data.length} total rows`,
        });
      } else {
        toast({
          title: "Import Failed",
          description: "No valid properties found in the file. Check the format and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to import Excel file",
        variant: "destructive",
      });
    }
    
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Read Excel file and convert to JSON
  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error("Failed to read file"));
            return;
          }
          
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsBinaryString(file);
    });
  };
  
  // Validate imported properties
  const validateProperties = (data: any[]): { validProperties: Partial<InsertProperty>[], invalidReasons: string[] } => {
    const validProperties: Partial<InsertProperty>[] = [];
    const invalidReasons: string[] = [];
    
    data.forEach((row, index) => {
      try {
        // Check if all required columns are present
        const missingColumns = requiredColumns.filter(col => row[col] === undefined);
        
        if (missingColumns.length > 0) {
          invalidReasons.push(`Row ${index + 2}: Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }
        
        // Validate numeric fields
        const numericFields = ['price', 'area', 'pricePerSqFt', 'bedrooms', 'bathrooms', 'floors', 'latitude', 'longitude'];
        const invalidNumeric = numericFields
          .filter(field => row[field] !== undefined)
          .filter(field => isNaN(Number(row[field])));
        
        if (invalidNumeric.length > 0) {
          invalidReasons.push(`Row ${index + 2}: Invalid numeric values in: ${invalidNumeric.join(', ')}`);
          return;
        }
        
        // Convert array fields from comma-separated strings if needed
        const arrayFields = ['amenities', 'tags', 'images'];
        arrayFields.forEach(field => {
          if (row[field] && typeof row[field] === 'string') {
            row[field] = row[field].split(',').map((item: string) => item.trim());
          }
        });
        
        // Convert boolean fields
        const booleanFields = ['isFeatured', 'isVerified'];
        booleanFields.forEach(field => {
          if (row[field] !== undefined) {
            if (typeof row[field] === 'string') {
              const value = row[field].toLowerCase();
              row[field] = value === 'true' || value === 'yes' || value === '1';
            } else {
              row[field] = Boolean(row[field]);
            }
          }
        });
        
        // Basic validation passed, create property object
        const property: any = {
          title: row.title,
          description: row.description,
          price: Number(row.price),
          propertyType: row.propertyType,
          location: row.location,
          address: row.address,
          area: Number(row.area),
          latitude: Number(row.latitude),
          longitude: Number(row.longitude),
        };
        
        // Add optional fields if present
        optionalColumns.forEach(col => {
          if (row[col] !== undefined) {
            property[col as keyof InsertProperty] = row[col];
          }
        });
        
        validProperties.push(property);
      } catch (error) {
        invalidReasons.push(`Row ${index + 2}: Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
    
    return { validProperties, invalidReasons };
  };
  
  // Handle import button click
  const handleImport = () => {
    if (importedData.length === 0) {
      toast({
        title: "No Data",
        description: "Please import an Excel file first",
        variant: "destructive",
      });
      return;
    }
    
    onImport(importedData);
    
    toast({
      title: "Import Started",
      description: `Processing ${importedData.length} properties...`,
    });
  };
  
  // Download sample Excel template
  const downloadSampleTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        title: "Sample Property",
        description: "This is a sample property description",
        price: 5000000,
        pricePerSqFt: 4500,
        propertyType: "2 BHK",
        location: "Gomti Nagar",
        address: "123 Sample Street, Lucknow",
        area: 1200,
        floors: 2,
        bedrooms: 2,
        bathrooms: 2,
        builder: "Sample Builder",
        possessionDate: "Ready to Move",
        latitude: 26.8467,
        longitude: 80.9462,
        amenities: "Gym,Swimming Pool,Garden",
        isFeatured: true,
        isVerified: true,
        tags: "Premium,New Construction",
        featuredImage: "https://example.com/image.jpg",
        images: "https://example.com/image1.jpg,https://example.com/image2.jpg"
      }
    ]);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");
    
    // Auto-size columns
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:Z1');
    for (let col = range.s.c; col <= range.e.c; ++col) {
      let max = 0;
      for (let row = range.s.r; row <= range.e.r; ++row) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
        if (cell && cell.v) {
          const length = String(cell.v).length;
          if (length > max) max = length;
        }
      }
      worksheet['!cols'] = worksheet['!cols'] || [];
      worksheet['!cols'][col] = { wch: max + 2 };
    }
    
    // Save the workbook
    XLSX.writeFile(workbook, "property_template.xlsx");
    
    toast({
      title: "Template Downloaded",
      description: "Sample Excel template has been downloaded",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Properties from Excel</CardTitle>
        <CardDescription>
          Upload an Excel file with property details for bulk import
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => {
                setSampleVisible(!sampleVisible);
                if (!sampleVisible) {
                  downloadSampleTemplate();
                }
              }}
            >
              {sampleVisible ? "Hide Sample" : "Download Template"}
            </Button>
          </div>
          
          {sampleVisible && (
            <Alert>
              <AlertDescription>
                <p className="mb-2 font-medium">Required Columns:</p>
                <ul className="list-disc pl-5 text-sm">
                  {requiredColumns.map(col => (
                    <li key={col}>{col}</li>
                  ))}
                </ul>
                <p className="mt-2 mb-2 font-medium">Optional Columns:</p>
                <ul className="list-disc pl-5 text-sm">
                  {optionalColumns.map(col => (
                    <li key={col}>{col}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm">
                  <strong>Note:</strong> For array fields (amenities, tags, images), 
                  use comma-separated values. For boolean fields (isFeatured, isVerified), 
                  use 'true/false' or 'yes/no'.
                </p>
              </AlertDescription>
            </Alert>
          )}
          
          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Rows: {progress.total}</span>
                <span className="text-green-600">Valid: {progress.valid}</span>
                <span className="text-red-600">Invalid: {progress.invalid}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(progress.valid / progress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {importedData.length > 0 && (
            <div className="border rounded-md overflow-auto max-h-48">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Coordinates</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importedData.slice(0, 5).map((property:any, index) => (
                    <TableRow key={index}>
                      <TableCell>{property.title}</TableCell>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>₹{(Number(property.price) / 100000).toFixed(2)} Lakh</TableCell>
                      <TableCell>{property.propertyType}</TableCell>
                      <TableCell>
                        {property.latitude?.toFixed(6)}, {property.longitude?.toFixed(6)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {importedData.length > 5 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        ... and {importedData.length - 5} more properties
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {errors.length > 0 && (
            <div className="border border-red-200 rounded-md p-3 bg-red-50">
              <h4 className="font-medium text-red-800 mb-2">Import Errors</h4>
              <ul className="list-disc pl-5 text-sm text-red-700 max-h-32 overflow-y-auto">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setImportedData([]);
            setErrors([]);
            setProgress(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          disabled={importedData.length === 0 || isLoading}
        >
          Clear
        </Button>
        <Button
          onClick={handleImport}
          disabled={importedData.length === 0 || isLoading}
        >
          {isLoading ? "Importing..." : `Import ${importedData.length} Properties`}
        </Button>
      </CardFooter>
    </Card>
  );
}