import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polygon, Rectangle, useMap, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Property type definitions for drawn shapes
export type PropertyShapeType = 'marker' | 'polygon' | 'rectangle' | 'plot';
export type PropertyCategoryType = 
  | 'Residential' 
  | 'Commercial' 
  | 'Plot' 
  | 'Villa' 
  | 'Apartment' 
  | 'Shop' 
  | 'Office' 
  | 'Warehouse'
  | 'Industrial'
  | 'Agricultural';

export interface PropertyShape {
  id: string;
  type: PropertyShapeType;
  color: string;
  coordinates: number[][] | [number, number];
  category: PropertyCategoryType;
  name?: string;
  status?: 'Available' | 'Sold Out' | 'Coming Soon';
  zIndex?: number;
  block?: string;
  tower?: string;
}

export interface AdminDrawingToolsProps {
  onShapesChange?: (shapes: PropertyShape[]) => void;
  initialShapes?: PropertyShape[];
  onCoordinateChange?: (lat: number, lng: number) => void;
}

// Color scheme for different property types
const propertyTypeColors: Record<PropertyCategoryType, string> = {
  'Residential': '#3388ff', // Blue
  'Commercial': '#9933cc', // Purple
  'Plot': '#ff9900',       // Orange
  'Villa': '#33cc33',      // Green
  'Apartment': '#3388ff',  // Blue
  'Shop': '#ffcc00',       // Yellow
  'Office': '#00cccc',     // Cyan
  'Warehouse': '#ff3333',  // Red
  'Industrial': '#666666', // Dark Gray
  'Agricultural': '#99cc00' // Light Green
};

// Controller component to handle map interactions
function MapController({ 
  drawingMode, 
  shapeType,
  category,
  onMapClick,
  onComplete,
  drawingPoints,
  onCancel
}: { 
  drawingMode: boolean; 
  shapeType: PropertyShapeType;
  category: PropertyCategoryType;
  onMapClick: (e: L.LeafletMouseEvent) => void;
  onComplete: () => void;
  drawingPoints: [number, number][];
  onCancel: () => void;
}) {
  const map = useMap();
  
  // Set up click handler when drawing is active
  useEffect(() => {
    if (drawingMode) {
      map.on('click', onMapClick);
    } else {
      map.off('click', onMapClick);
    }
    
    return () => {
      map.off('click', onMapClick);
    };
  }, [map, drawingMode, onMapClick]);

  // Display temporary line while drawing polygon
  useEffect(() => {
    if (drawingMode && (shapeType === 'polygon' || shapeType === 'rectangle' || shapeType === 'plot') && drawingPoints.length > 1) {
      const tempLine = L.polyline(drawingPoints, { 
        color: propertyTypeColors[category], 
        weight: 3, 
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(map);
      
      return () => {
        map.removeLayer(tempLine);
      };
    }
  }, [map, drawingMode, shapeType, drawingPoints, category]);
  
  // Display instruction message
  useEffect(() => {
    if (drawingMode) {
      const DrawingInstructionControl = L.Control.extend({
        onAdd: function() {
          const div = L.DomUtil.create('div', 'drawing-instructions');
          div.innerHTML = `
            <div class="bg-white p-2 rounded shadow-md text-sm font-medium border-l-4 border-primary">
              ${shapeType === 'marker' 
                ? 'Click on the map to place a marker' 
                : shapeType === 'rectangle'
                  ? 'Click to place first corner, then click again to complete rectangle'
                  : 'Click to add points, then click "Finish" to complete shape'}
            </div>
          `;
          return div;
        }
      });
      
      const instructionControl = new DrawingInstructionControl({ position: 'topright' });
      map.addControl(instructionControl);
      
      return () => {
        try {
          map.removeControl(instructionControl);
        } catch(e) {
          console.error("Failed to remove control:", e);
        }
      };
    }
  }, [map, drawingMode, shapeType]);
  
  return (
    <div className="absolute bottom-16 left-4 z-[1000] bg-white rounded-md shadow-lg p-2 flex flex-col gap-2">
      {drawingMode && (
        <div className="flex space-x-2 items-center">
          <div className="flex-1">
            <Badge variant="outline" className="bg-primary text-white">
              Drawing: {shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}
            </Badge>
          </div>
          
          {(shapeType === 'polygon' || shapeType === 'rectangle' || shapeType === 'plot') && drawingPoints.length > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={onComplete}
              className="text-xs"
            >
              Finish ({drawingPoints.length} pts)
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-xs"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

// Main Component
export default function AdminDrawingTools({ 
  onShapesChange, 
  initialShapes = [],
  onCoordinateChange 
}: AdminDrawingToolsProps) {
  const [mapType, setMapType] = useState<"map" | "satellite" | "terrain" | "hybrid">("map");
  const [shapes, setShapes] = useState<PropertyShape[]>(initialShapes);
  const [selectedShape, setSelectedShape] = useState<PropertyShape | null>(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
  const [drawingType, setDrawingType] = useState<PropertyShapeType>('marker');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategoryType>('Residential');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showHelpTips, setShowHelpTips] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([26.8467, 80.9462]); // Lucknow coordinates
  const [mapZoom, setMapZoom] = useState(12);
  
  // Update parent component when shapes change
  useEffect(() => {
    onShapesChange && onShapesChange(shapes);
  }, [shapes, onShapesChange]);
  
  // Handle map click during drawing
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    const coords: [number, number] = [lat, lng];
    
    // Update center coordinates
    if (onCoordinateChange) {
      onCoordinateChange(lat, lng);
    }
    
    if (drawingType === 'marker') {
      // For marker, immediately create and add shape
      const newShape: PropertyShape = {
        id: Date.now().toString(),
        type: 'marker',
        color: propertyTypeColors[selectedCategory],
        coordinates: coords,
        category: selectedCategory,
        name: `${selectedCategory} Location`,
      };
      
      setShapes([...shapes, newShape]);
      setDrawingMode(false);
    } else if (drawingType === 'rectangle' && drawingPoints.length === 0) {
      // First point of rectangle
      setDrawingPoints([coords]);
    } else if (drawingType === 'rectangle' && drawingPoints.length === 1) {
      // Second point of rectangle, complete it
      const firstPoint = drawingPoints[0];
      
      // Calculate all four corners of the rectangle
      const rectanglePoints: [number, number][] = [
        firstPoint,
        [firstPoint[0], coords[1]],
        coords,
        [coords[0], firstPoint[1]],
        firstPoint // Close the shape
      ];
      
      const newShape: PropertyShape = {
        id: Date.now().toString(),
        type: 'rectangle',
        color: propertyTypeColors[selectedCategory],
        coordinates: rectanglePoints,
        category: selectedCategory,
        name: `${selectedCategory} Area`,
      };
      
      setShapes([...shapes, newShape]);
      setDrawingPoints([]);
      setDrawingMode(false);
    } else if (drawingType === 'polygon' || drawingType === 'plot') {
      // Add point to polygon/plot drawing
      setDrawingPoints([...drawingPoints, coords]);
    }
  };
  
  // Complete the polygon drawing
  const completeDrawing = () => {
    if (drawingPoints.length < 3) {
      alert("Need at least 3 points to complete a shape");
      return;
    }
    
    // Close the shape
    const closedShape = [...drawingPoints, drawingPoints[0]];
    
    const newShape: PropertyShape = {
      id: Date.now().toString(),
      type: drawingType,
      color: propertyTypeColors[selectedCategory],
      coordinates: closedShape,
      category: selectedCategory,
      name: `${selectedCategory} ${drawingType === 'plot' ? 'Plot' : 'Area'}`,
    };
    
    setShapes([...shapes, newShape]);
    setDrawingPoints([]);
    setDrawingMode(false);
  };
  
  // Cancel drawing
  const cancelDrawing = () => {
    setDrawingPoints([]);
    setDrawingMode(false);
  };
  
  // Start drawing of a specific type
  const startDrawing = (type: PropertyShapeType) => {
    setDrawingType(type);
    setDrawingMode(true);
    setDrawingPoints([]);
  };
  
  // Select a shape for editing
  const selectShape = (shape: PropertyShape) => {
    setSelectedShape(shape);
  };
  
  // Delete selected shape
  const deleteSelectedShape = () => {
    if (selectedShape) {
      setShapes(shapes.filter(s => s.id !== selectedShape.id));
      setSelectedShape(null);
      setShowDeleteDialog(false);
    }
  };
  
  // Get tile layer URL based on map type
  const getTileLayer = () => {
    switch (mapType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png';
      case 'hybrid':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'map':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };
  
  // Render a shape based on its type
  const renderShape = (shape: PropertyShape) => {
    const isSelected = selectedShape?.id === shape.id;
    
    if (shape.type === 'marker') {
      const coords = shape.coordinates as [number, number];
      
      // Create a marker icon based on property type
      const markerHtml = `
        <div class="flex flex-col items-center">
          <div class="bg-white border-4 rounded-full shadow-lg w-8 h-8 flex items-center justify-center"
               style="border-color: ${shape.color};">
            <span style="color: ${shape.color}; font-weight: bold;">P</span>
          </div>
          ${shape.name ? `<div class="mt-1 bg-white px-2 py-0.5 rounded shadow text-xs">${shape.name}</div>` : ''}
        </div>
      `;
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: markerHtml,
        iconSize: [40, 60],
        iconAnchor: [20, 40]
      });
      
      return (
        <Marker 
          key={shape.id}
          position={coords}
          icon={icon}
          eventHandlers={{
            click: () => selectShape(shape)
          }}
        >
          <Popup>
            <div className="text-center p-1">
              <h3 className="font-semibold text-base">{shape.name || 'Property Marker'}</h3>
              <p className="text-xs text-gray-600">{shape.category}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 w-full"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </Button>
            </div>
          </Popup>
        </Marker>
      );
    } else {
      // For polygon, rectangle, or plot shapes
      const coords = shape.coordinates as [number, number][];
      
      return (
        <Polygon
          key={shape.id}
          positions={coords}
          pathOptions={{
            color: shape.color,
            fillColor: shape.color,
            fillOpacity: isSelected ? 0.5 : 0.3,
            weight: isSelected ? 3 : 2,
          }}
          eventHandlers={{
            click: () => selectShape(shape)
          }}
        >
          <Popup>
            <div className="text-center p-1">
              <h3 className="font-semibold text-base">{shape.name || 'Area'}</h3>
              <p className="text-xs text-gray-600">{shape.category} {shape.type}</p>
              <div className="mt-1 flex justify-between text-xs">
                <span>Status: {shape.status || 'Available'}</span>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 w-full"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </Button>
            </div>
          </Popup>
        </Polygon>
      );
    }
  };
  
  return (
    <div className="relative">
      {showHelpTips && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Draw property boundaries by selecting a shape type and property category below.
            Click on the map to place points. For polygons and plots, click "Finish" when done.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-2">Drawing Tools</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                variant={drawingType === 'marker' && drawingMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => startDrawing('marker')}
                disabled={drawingMode && drawingType !== 'marker'}
                className="flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Marker
              </Button>
              
              <Button
                variant={drawingType === 'polygon' && drawingMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => startDrawing('polygon')}
                disabled={drawingMode && drawingType !== 'polygon'}
                className="flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                </svg>
                Polygon
              </Button>
              
              <Button
                variant={drawingType === 'rectangle' && drawingMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => startDrawing('rectangle')}
                disabled={drawingMode && drawingType !== 'rectangle'}
                className="flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
                Rectangle
              </Button>
              
              <Button
                variant={drawingType === 'plot' && drawingMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => startDrawing('plot')}
                disabled={drawingMode && drawingType !== 'plot'}
                className="flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M3 3v18h18"></path>
                  <path d="M7 15 l4 -7 l4 4 l4 -8"></path>
                </svg>
                Plot
              </Button>
            </div>
            
            <h3 className="text-lg font-medium mb-2">Property Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(propertyTypeColors).map(([type, color]) => (
                <Button
                  key={type}
                  variant={selectedCategory === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(type as PropertyCategoryType)}
                  className="text-xs overflow-hidden"
                  style={{
                    borderColor: color,
                    ...(selectedCategory !== type && { color }),
                    ...(selectedCategory === type && { backgroundColor: color })
                  }}
                >
                  {type}
                </Button>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="text-lg font-medium mb-2">Drawn Shapes</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {shapes.length === 0 ? (
                <p className="text-sm text-gray-500">No shapes drawn yet</p>
              ) : (
                shapes.map((shape, index) => (
                  <div 
                    key={shape.id} 
                    className={`flex items-center bg-gray-50 p-2 rounded ${selectedShape?.id === shape.id ? 'border-2 border-primary' : 'border'}`}
                    onClick={() => selectShape(shape)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: shape.color }}
                    ></div>
                    <span className="text-sm truncate flex-1">
                      {shape.name || `${shape.category} ${shape.type}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-red-500 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectShape(shape);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="col-span-1 md:col-span-4 h-[500px] relative rounded-lg overflow-hidden">
          <MapContainer 
            center={mapCenter}
            zoom={mapZoom} 
            className="h-full w-full"
          >
            <TileLayer
              url={getTileLayer()}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {shapes.map(shape => renderShape(shape))}
            
            {/* Temporary drawing shape */}
            {drawingMode && drawingPoints.length > 0 && (drawingType === 'polygon' || drawingType === 'plot') && (
              <Polygon
                positions={drawingPoints}
                pathOptions={{
                  color: propertyTypeColors[selectedCategory],
                  fillColor: propertyTypeColors[selectedCategory],
                  fillOpacity: 0.3,
                  weight: 2,
                  dashArray: '5, 10'
                }}
              />
            )}
            
            <MapController 
              drawingMode={drawingMode}
              shapeType={drawingType}
              category={selectedCategory}
              onMapClick={handleMapClick}
              onComplete={completeDrawing}
              drawingPoints={drawingPoints}
              onCancel={cancelDrawing}
            />
          </MapContainer>
          
          {/* Map type selector */}
          <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-md shadow-lg p-2">
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value as any)}
              className="px-2 py-1 text-xs rounded border border-gray-300 bg-white"
            >
              <option value="map">Standard Map</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      {showDeleteDialog && selectedShape && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">Delete Shape?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this shape? This cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deleteSelectedShape}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}