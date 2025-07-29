import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, Polygon, Circle, useMap, Popup } from "react-leaflet";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Property type definitions
export type PropertyShapeType = 'marker' | 'polygon' | 'rectangle' | 'plot';
export type PropertyCategoryType = 'Residential' | 'Commercial' | 'Plot' | 'Villa' | 'Apartment' | 'Shop';

export interface PropertyShape {
  id: string;
  type: PropertyShapeType;
  color: string;
  coordinates: number[][] | [number, number];
  category: PropertyCategoryType;
  name?: string;
}

export interface AdminDrawingMapRef {
  getShapes: () => PropertyShape[];
  getCenter: () => { latitude: number; longitude: number } | null;
  getSelectedShape: () => PropertyShape | null;
  clearShapes: () => void;
}

interface AdminDrawingMapProps {
  onCoordinateChange?: (lat: number, lng: number) => void;
  onShapesChange?: (shapes: PropertyShape[]) => void;
  initialShapes?: PropertyShape[];
}

// Color scheme for different property types
const propertyTypeColors: Record<PropertyCategoryType, string> = {
  'Residential': '#3388ff', // Blue
  'Commercial': '#9933cc', // Purple
  'Plot': '#ff3333',       // Red
  'Villa': '#33cc33',      // Green
  'Apartment': '#ff9900',  // Orange
  'Shop': '#ff66b2',       // Pink
};

// Map controller to handle clicks and events
function MapController({ 
  onMapClick, 
  onMoveEnd,
  drawingMode,
  shapeType,
  activeStep = 0,
  onStepComplete,
  onCancel
}: { 
  onMapClick: (lat: number, lng: number) => void;
  onMoveEnd?: () => void;
  drawingMode: boolean;
  shapeType: PropertyShapeType;
  activeStep?: number;
  onStepComplete?: (coordinates: [number, number]) => void;
  onCancel?: () => void;
}) {
  const map = useMap();
  const clickRef = useRef(onMapClick);
  const moveEndRef = useRef(onMoveEnd);
  
  // Update refs when props change
  useEffect(() => {
    clickRef.current = onMapClick;
    moveEndRef.current = onMoveEnd;
  }, [onMapClick, onMoveEnd]);
  
  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      // Only handle clicks when in drawing mode
      if (drawingMode) {
        clickRef.current(e.latlng.lat, e.latlng.lng);
        onStepComplete && onStepComplete([e.latlng.lat, e.latlng.lng]);
      }
    };
    
    const handleMoveEnd = () => {
      moveEndRef.current && moveEndRef.current();
    };
    
    map.on('click', handleClick);
    map.on('moveend', handleMoveEnd);
    
    return () => {
      map.off('click', handleClick);
      map.off('moveend', handleMoveEnd);
    };
  }, [map, drawingMode, onStepComplete]);
  
  // Show drawing instructions
  useEffect(() => {
    if (drawingMode) {
      let instructions = "";
      
      if (shapeType === 'marker') {
        instructions = "Click on the map to place a marker for your property.";
      } else if (shapeType === 'polygon' || shapeType === 'rectangle' || shapeType === 'plot') {
        if (activeStep === 0) {
          instructions = "Click on the map to place the first corner of your property.";
        } else {
          instructions = "Continue clicking to add corners. Double-click or use Finish button to complete.";
        }
      }
      
      const container = L.DomUtil.create('div', 'drawing-instructions');
      container.innerHTML = `
        <div style="
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(255, 255, 255, 0.9);
          padding: 8px 16px;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          pointer-events: none;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        ">
          <div>${instructions}</div>
          <div style="font-size: 12px; margin-top: 4px; color: #666;">
            Press ESC to cancel drawing
          </div>
        </div>
      `;
      
      document.querySelector('.leaflet-container')?.appendChild(container);
      
      // Handle escape key to cancel drawing
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && onCancel) {
          onCancel();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.querySelector('.drawing-instructions')?.remove();
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [drawingMode, shapeType, activeStep, onCancel]);
  
  return null;
}

// Main component
const AdminDrawingMap = forwardRef<AdminDrawingMapRef, AdminDrawingMapProps>(
  ({ onCoordinateChange, onShapesChange, initialShapes = [] }, ref) => {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [mapType, setMapType] = useState<"map" | "satellite" | "terrain" | "hybrid">("map");
    const [shapes, setShapes] = useState<PropertyShape[]>(initialShapes);
    const [selectedShape, setSelectedShape] = useState<PropertyShape | null>(null);
    const [centerCoordinates, setCenterCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
    const [drawingMode, setDrawingMode] = useState(false);
    const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
    const [drawingType, setDrawingType] = useState<PropertyShapeType>('marker');
    const [selectedCategory, setSelectedCategory] = useState<PropertyCategoryType>('Residential');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    
    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      getShapes: () => shapes,
      getCenter: () => centerCoordinates,
      getSelectedShape: () => selectedShape,
      clearShapes: () => {
        setShapes([]);
        setSelectedShape(null);
        setCenterCoordinates(null);
        setDrawingMode(false);
        setDrawingPoints([]);
      }
    }));
    
    // Update parent component when shapes change
    useEffect(() => {
      onShapesChange && onShapesChange(shapes);
    }, [shapes, onShapesChange]);
    
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
    
    // Start drawing mode with specified shape type
    const startDrawing = (type: PropertyShapeType) => {
      setDrawingMode(true);
      setDrawingType(type);
      setDrawingPoints([]);
      
      toast({
        title: `Drawing ${type}`,
        description: `Click on the map to start drawing a ${type}`,
      });
    };
    
    // Cancel current drawing
    const cancelDrawing = () => {
      setDrawingMode(false);
      setDrawingPoints([]);
    };
    
    // Handle map click when in drawing mode
    const handleMapClick = (lat: number, lng: number) => {
      if (!drawingMode) return;
      
      if (drawingType === 'marker') {
        // For markers, we immediately create the shape
        const newShape: PropertyShape = {
          id: Date.now().toString(),
          type: 'marker',
          color: propertyTypeColors[selectedCategory],
          coordinates: [lat, lng] as [number, number],
          category: selectedCategory,
        };
        
        setShapes([...shapes, newShape]);
        setCenterCoordinates({ latitude: lat, longitude: lng });
        onCoordinateChange && onCoordinateChange(lat, lng);
        setDrawingMode(false);
        
        toast({
          title: "Marker Added",
          description: `Added a ${selectedCategory} marker at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        });
      } else {
        // For polygons and rectangles, we add points until drawing is completed
        setDrawingPoints([...drawingPoints, [lat, lng]]);
      }
    };
    
    // Complete the current drawing
    const completeDrawing = () => {
      if (drawingPoints.length < 3 && (drawingType === 'polygon' || drawingType === 'plot')) {
        toast({
          title: "Not enough points",
          description: "You need at least 3 points to create a polygon",
          variant: "destructive",
        });
        return;
      }
      
      if (drawingPoints.length < 2 && drawingType === 'rectangle') {
        toast({
          title: "Not enough points",
          description: "You need at least 2 points to create a rectangle",
          variant: "destructive",
        });
        return;
      }
      
      let coordinates: [number, number][] = [...drawingPoints];
      
      // For rectangles, we create 4 points from the 2 corners
      if (drawingType === 'rectangle' && drawingPoints.length >= 2) {
        const [p1, p2] = drawingPoints;
        coordinates = [
          p1,
          [p1[0], p2[1]],
          p2,
          [p2[0], p1[1]],
          p1, // Close the rectangle
        ];
      }
      
      // Ensure polygon is closed
      if ((drawingType === 'polygon' || drawingType === 'plot' || drawingType === 'rectangle') && 
          coordinates.length > 0 && 
          (coordinates[0][0] !== coordinates[coordinates.length - 1][0] || 
           coordinates[0][1] !== coordinates[coordinates.length - 1][1])) {
        coordinates.push(coordinates[0]);
      }
      
      // Calculate center of the shape
      const latSum = coordinates.reduce((sum, point) => sum + point[0], 0);
      const lngSum = coordinates.reduce((sum, point) => sum + point[1], 0);
      const center = {
        latitude: latSum / coordinates.length,
        longitude: lngSum / coordinates.length
      };
      
      const newShape: PropertyShape = {
        id: Date.now().toString(),
        type: drawingType,
        color: propertyTypeColors[selectedCategory],
        coordinates: coordinates,
        category: selectedCategory,
      };
      
      setShapes([...shapes, newShape]);
      setCenterCoordinates(center);
      onCoordinateChange && onCoordinateChange(center.latitude, center.longitude);
      setDrawingMode(false);
      setDrawingPoints([]);
      
      toast({
        title: `${drawingType.charAt(0).toUpperCase() + drawingType.slice(1)} Added`,
        description: `Added a ${selectedCategory} ${drawingType} with ${coordinates.length} points`,
      });
    };
    
    // Handle selecting a shape
    const selectShape = (shape: PropertyShape) => {
      setSelectedShape(shape);
      
      // Update center coordinates
      if (shape.type === 'marker') {
        const [lat, lng] = shape.coordinates as [number, number];
        setCenterCoordinates({ latitude: lat, longitude: lng });
        onCoordinateChange && onCoordinateChange(lat, lng);
      } else {
        // For polygons and rectangles, calculate the center
        const points = shape.coordinates as number[][];
        const latSum = points.reduce((sum, point) => sum + point[0], 0);
        const lngSum = points.reduce((sum, point) => sum + point[1], 0);
        const center = {
          latitude: latSum / points.length,
          longitude: lngSum / points.length
        };
        
        setCenterCoordinates(center);
        onCoordinateChange && onCoordinateChange(center.latitude, center.longitude);
      }
      
      toast({
        title: "Shape Selected",
        description: `Selected a ${shape.category} ${shape.type}`,
      });
    };
    
    // Delete a shape
    const deleteSelectedShape = () => {
      if (!selectedShape) return;
      
      const updatedShapes = shapes.filter(shape => shape.id !== selectedShape.id);
      setShapes(updatedShapes);
      setSelectedShape(null);
      setShowDeleteDialog(false);
      
      toast({
        title: "Shape Deleted",
        description: `Deleted a ${selectedShape.category} ${selectedShape.type}`,
      });
    };
    
    return (
      <div className="flex flex-col bg-white rounded-md overflow-hidden border shadow-sm">
        <div className="bg-white p-3 border-b">
          <h3 className="font-medium text-gray-700 mb-2">Property Map</h3>
          <p className="text-sm text-gray-500 mb-3">
            Draw your property boundaries on the map using the drawing tools.
          </p>
          
          {/* Property Type Buttons */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Property Type</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(propertyTypeColors).map(([category, color]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as PropertyCategoryType)}
                  className={`p-3 text-xs rounded-full transition-colors flex items-center ${
                    selectedCategory === category 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span 
                    className="inline-block w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: color }}
                  ></span>
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Drawing Tools */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Drawing Tools</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startDrawing('marker')}
                disabled={drawingMode}
                className="text-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Marker
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => startDrawing('polygon')}
                disabled={drawingMode}
                className="text-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M3 6l6-3 6 3 6-3v12l-6 3-6-3-6 3z"></path>
                  <path d="M9 3v12m6-9v12"></path>
                </svg>
                Polygon
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => startDrawing('rectangle')}
                disabled={drawingMode}
                className="text-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
                Rectangle
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => startDrawing('plot')}
                disabled={drawingMode}
                className="text-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Plot
              </Button>
            </div>
          </div>
          
          {/* Drawing Controls */}
          {drawingMode && (
            <div className="mb-3 flex items-center space-x-2 bg-blue-50 p-2 rounded">
              <Badge variant="outline" className="bg-blue-100">
                Drawing: {drawingType}
              </Badge>
              
              <div className="flex-grow"></div>
              
              {(drawingType === 'polygon' || drawingType === 'rectangle' || drawingType === 'plot') && drawingPoints.length > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={completeDrawing}
                  className="text-xs"
                >
                  Finish ({drawingPoints.length} points)
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={cancelDrawing}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          )}
          
          {/* Map Type Selector */}
          <div className="flex justify-between items-center">
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
            
            {selectedShape && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-gray-100">
                  Selected: {selectedShape.category} {selectedShape.type}
                </Badge>
                
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="text-xs"
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the selected shape.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteSelectedShape}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          
          {centerCoordinates && (
            <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
              <span className="font-semibold">Selected coordinates:</span>{' '}
              {centerCoordinates.latitude.toFixed(6)}, {centerCoordinates.longitude.toFixed(6)}
            </div>
          )}
        </div>
        
        {/* Map Container */}
        <div
          className="w-full border-t"
          style={{ height: isMobile ? '50vh' : '60vh' }}
        >
          <MapContainer
            center={[26.8467, 80.9462]} // Lucknow coordinates
            zoom={12}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution={
                mapType === 'satellite' || mapType === 'hybrid' 
                  ? '&copy; <a href="https://www.esri.com/">Esri</a>'
                  : mapType === 'terrain'
                    ? 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>'
                    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
              url={getTileLayer()}
              subdomains='abcd'
            />
            
            {/* Map Controller */}
            <MapController 
              onMapClick={handleMapClick} 
              drawingMode={drawingMode}
              shapeType={drawingType}
              activeStep={drawingPoints.length}
              onCancel={cancelDrawing}
            />
            
            {/* Render existing shapes */}
            {shapes.map(shape => {
              if (shape.type === 'marker') {
                const [lat, lng] = shape.coordinates as [number, number];
                return (
                  <Marker
                    key={shape.id}
                    position={[lat, lng]}
                    eventHandlers={{
                      click: () => selectShape(shape)
                    }}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong>Type:</strong> {shape.category}<br/>
                        <strong>Coordinates:</strong> {lat.toFixed(6)}, {lng.toFixed(6)}
                      </div>
                    </Popup>
                  </Marker>
                );
              } else {
                const coordinates:any = shape.coordinates as number[][];
                return (
                  <Polygon
                    key={shape.id}
                    positions={coordinates}
                    pathOptions={{
                      color: shape.color,
                      fillColor: shape.color,
                      fillOpacity: 0.4,
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => selectShape(shape)
                    }}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong>Type:</strong> {shape.category} {shape.type}<br/>
                        <strong>Points:</strong> {coordinates.length}
                      </div>
                    </Popup>
                  </Polygon>
                );
              }
            })}
            
            {/* Render current drawing */}
            {drawingMode && drawingPoints.length > 0 && (
              <>
                {/* Connect the dots with a line */}
                <Polygon
                  positions={drawingPoints}
                  pathOptions={{
                    color: propertyTypeColors[selectedCategory],
                    weight: 2,
                    dashArray: '5, 5',
                    fill: false,
                  }}
                />
                
                {/* Show points */}
                {drawingPoints.map((point, index) => (
                  <Circle
                    key={`drawing-point-${index}`}
                    center={point}
                    radius={5}
                    pathOptions={{
                      color: propertyTypeColors[selectedCategory],
                      fillColor: propertyTypeColors[selectedCategory],
                      fillOpacity: 1,
                    }}
                  />
                ))}
              </>
            )}
          </MapContainer>
        </div>
        
        <div className="p-3 border-t bg-gray-50">
          <div className="text-xs text-gray-500">
            <strong>Instructions:</strong> 
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Select a property type first to set colors for your drawing.</li>
              <li>Use the drawing tools to create shapes on the map.</li>
              <li>For buildings, use polygon or rectangle to outline the structure.</li>
              <li>For plots, use the plot tool to draw the exact boundaries.</li>
              <li>Click on a shape to select it, then use the delete button to remove it.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
);

AdminDrawingMap.displayName = "AdminDrawingMap";

export default AdminDrawingMap;