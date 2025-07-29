import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, FeatureGroup, Popup } from "react-leaflet";
//import { EditControl } from "react-leaflet-draw";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Make sure these are properly imported in index.html or imported here
// These are needed for the react-leaflet-draw markers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface ShapeData {
  id: string;
  type: 'marker' | 'polygon' | 'rectangle' | 'circle';
  color: string;
  coordinates: number[][] | [number, number];
  propertyType: string;
  title?: string;
}

export interface AdminPropertyMapRef {
  getDrawnShapes: () => ShapeData[];
  setCoordinates: (lat: number, lng: number) => void;
  getCoordinates: () => { latitude: number; longitude: number } | null;
  clearMap: () => void;
}

interface PropertyMapProps {
  onChange?: (shapes: ShapeData[]) => void;
  onSelectCoordinate?: (lat: number, lng: number) => void;
  initialShapes?: ShapeData[];
}

const propertyTypeColors: Record<string, string> = {
  'Residential': '#3388ff', // Blue
  'Plot': '#ff0000',        // Red
  'Villa': '#33cc33',       // Green
  'Apartment': '#ff9900',   // Orange
  'Commercial': '#9900cc',  // Purple
  'Shops': '#ff66b2',       // Pink
};

const AdminPropertyMap = forwardRef<AdminPropertyMapRef, PropertyMapProps>(
  ({ onChange, onSelectCoordinate, initialShapes = [] }, ref) => {
    const isMobile = useIsMobile();
    const { toast } = useToast();
    const [mapType, setMapType] = useState<"map" | "satellite" | "terrain" | "hybrid">("map");
    const [shapes, setShapes] = useState<ShapeData[]>(initialShapes);
    const [selectedColor, setSelectedColor] = useState<string>(propertyTypeColors.Residential);
    const [selectedPropertyType, setSelectedPropertyType] = useState<string>('Residential');
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
    const featureGroupRef = useRef<L.FeatureGroup | null>(null);
    
    // Expose functions to parent via ref
    useImperativeHandle(ref, () => ({
      getDrawnShapes: () => shapes,
      setCoordinates: (lat: number, lng: number) => {
        setCoordinates({ latitude: lat, longitude: lng });
      },
      getCoordinates: () => coordinates,
      clearMap: () => {
        if (featureGroupRef.current) {
          featureGroupRef.current.clearLayers();
        }
        setShapes([]);
        setCoordinates(null);
      }
    }));
    
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
    
    // Format coordinates for display
    const formatCoord = (value: number) => value.toFixed(6);
    
    // Handle creation of shapes
    const handleCreated = (e: any) => {
      const { layerType, layer } = e;
      
      // Set shape color based on selected property type
      layer.setStyle && layer.setStyle({ color: selectedColor, fillColor: selectedColor });
      
      let shapeData: ShapeData;
      
      if (layerType === 'marker') {
        const { lat, lng } = layer.getLatLng();
        shapeData = {
          id: Date.now().toString(),
          type: 'marker',
          color: selectedColor,
          coordinates: [lat, lng] as [number, number],
          propertyType: selectedPropertyType,
        };
        
        // Update coordinates for parent form
        setCoordinates({ latitude: lat, longitude: lng });
        onSelectCoordinate && onSelectCoordinate(lat, lng);
      } else if (layerType === 'polygon' || layerType === 'rectangle') {
        const coordinates = layer.getLatLngs()[0].map((ll: L.LatLng) => [ll.lat, ll.lng]);
        shapeData = {
          id: Date.now().toString(),
          type: layerType as 'polygon' | 'rectangle',
          color: selectedColor,
          coordinates: coordinates,
          propertyType: selectedPropertyType,
        };
        
        // For polygons, use center point for the property location
        const bounds = layer.getBounds();
        const center = bounds.getCenter();
        setCoordinates({ latitude: center.lat, longitude: center.lng });
        onSelectCoordinate && onSelectCoordinate(center.lat, center.lng);
      } else if (layerType === 'circle') {
        const center = layer.getLatLng();
        const radius = layer.getRadius();
        
        // For circles, we store the center point and create a polygon approximation
        const points = 32; // Number of points to approximate the circle
        const coordinates: number[][] = [];
        
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const lat = center.lat + (radius / 111111) * Math.cos(angle);
          const lng = center.lng + (radius / (111111 * Math.cos(center.lat * (Math.PI / 180)))) * Math.sin(angle);
          coordinates.push([lat, lng]);
        }
        
        shapeData = {
          id: Date.now().toString(),
          type: 'circle',
          color: selectedColor,
          coordinates: coordinates,
          propertyType: selectedPropertyType,
        };
        
        setCoordinates({ latitude: center.lat, longitude: center.lng });
        onSelectCoordinate && onSelectCoordinate(center.lat, center.lng);
      } else {
        // Unsupported shape type
        return;
      }
      
      // Add popup with property type info
      layer.bindPopup(`
        <div class="text-center">
          <strong>Type:</strong> ${selectedPropertyType}<br>
          <strong>Coordinates:</strong> ${formatCoord(coordinates?.latitude || 0)}, ${formatCoord(coordinates?.longitude || 0)}
        </div>
      `);
      
      // Update shapes state
      const newShapes = [...shapes, shapeData];
      setShapes(newShapes);
      onChange && onChange(newShapes);
      
      toast({
        title: "Shape Added",
        description: `Added ${selectedPropertyType} at ${formatCoord(coordinates?.latitude || 0)}, ${formatCoord(coordinates?.longitude || 0)}`,
      });
    };
    
    // Handle editing of shapes
    const handleEdited = (e: any) => {
      const { layers } = e;
      
      // Update shapes with edited geometries
      const updatedShapes = [...shapes];
      
      layers.eachLayer((layer: any) => {
        // Find the corresponding shape by its ID
        const id = layer.options.id;
        const shapeIndex = updatedShapes.findIndex(s => s.id === id);
        
        if (shapeIndex !== -1) {
          const shape = updatedShapes[shapeIndex];
          
          if (shape.type === 'marker') {
            const { lat, lng } = layer.getLatLng();
            shape.coordinates = [lat, lng] as [number, number];
            
            // Update coordinates for parent form if this was the selected marker
            setCoordinates({ latitude: lat, longitude: lng });
            onSelectCoordinate && onSelectCoordinate(lat, lng);
          } else if (shape.type === 'polygon' || shape.type === 'rectangle') {
            const coordinates = layer.getLatLngs()[0].map((ll: L.LatLng) => [ll.lat, ll.lng]);
            shape.coordinates = coordinates;
            
            // Update the center point
            const bounds = layer.getBounds();
            const center = bounds.getCenter();
            setCoordinates({ latitude: center.lat, longitude: center.lng });
            onSelectCoordinate && onSelectCoordinate(center.lat, center.lng);
          } else if (shape.type === 'circle') {
            const center = layer.getLatLng();
            const radius = layer.getRadius();
            
            // Recalculate circle coordinates
            const points = 32;
            const coordinates: number[][] = [];
            
            for (let i = 0; i < points; i++) {
              const angle = (i / points) * Math.PI * 2;
              const lat = center.lat + (radius / 111111) * Math.cos(angle);
              const lng = center.lng + (radius / (111111 * Math.cos(center.lat * (Math.PI / 180)))) * Math.sin(angle);
              coordinates.push([lat, lng]);
            }
            
            shape.coordinates = coordinates;
            setCoordinates({ latitude: center.lat, longitude: center.lng });
            onSelectCoordinate && onSelectCoordinate(center.lat, center.lng);
          }
          
          // Update the popup content
          layer.setPopupContent(`
            <div class="text-center">
              <strong>Type:</strong> ${shape.propertyType}<br>
              <strong>Coordinates:</strong> ${formatCoord(coordinates?.latitude || 0)}, ${formatCoord(coordinates?.longitude || 0)}
            </div>
          `);
        }
      });
      
      setShapes(updatedShapes);
      onChange && onChange(updatedShapes);
      
      toast({
        title: "Shapes Updated",
        description: "The property boundaries have been updated",
      });
    };
    
    // Handle deletion of shapes
    const handleDeleted = (e: any) => {
      const { layers } = e;
      
      // Get the IDs of deleted layers and remove them from shapes
      const deletedIds: string[] = [];
      layers.eachLayer((layer: any) => {
        const id = layer.options.id;
        if (id) deletedIds.push(id);
      });
      
      const remainingShapes = shapes.filter(shape => !deletedIds.includes(shape.id));
      setShapes(remainingShapes);
      onChange && onChange(remainingShapes);
      
      // If we deleted the marker that was being used for coordinates, reset coordinates
      if (deletedIds.length > 0 && shapes.length !== remainingShapes.length) {
        setCoordinates(null);
      }
      
      toast({
        title: "Shapes Deleted",
        description: `Removed ${deletedIds.length} shapes from the map`,
      });
    };
    
    // Handle property type selection change
    const handlePropertyTypeChange = (type: string) => {
      setSelectedPropertyType(type);
      setSelectedColor(propertyTypeColors[type] || propertyTypeColors.Residential);
    };
    
    return (
      <div className="flex flex-col bg-white rounded-md overflow-hidden border shadow-sm">
        <div className="bg-white p-3 border-b">
          <h3 className="font-medium text-gray-700 mb-2">Property Boundaries</h3>
          <p className="text-sm text-gray-500 mb-3">
            Draw the property boundaries on the map. Use the drawing tools to create markers, polygons, or rectangles.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(propertyTypeColors).map(([type, color]) => (
              <button
                key={type}
                onClick={() => handlePropertyTypeChange(type)}
                className={`p-3 text-xs rounded-full transition-colors ${
                  selectedPropertyType === type 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                style={{ borderLeft: `4px solid ${color}` }}
              >
                {type}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value as any)}
              className="p-3 text-sm rounded border border-gray-300 bg-white"
            >
              <option value="map">Standard Map</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
              <option value="hybrid">Hybrid</option>
            </select>
            
            {coordinates && (
              <div className="text-xs bg-gray-100 rounded px-2 py-1 flex items-center">
                <span className="font-semibold mr-1">Coordinates:</span>
                <span>{formatCoord(coordinates.latitude)}, {formatCoord(coordinates.longitude)}</span>
              </div>
            )}
          </div>
        </div>
        
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
            
            <FeatureGroup ref={featureGroupRef}>
              {/* <EditControl
                position="topright"
                onCreated={handleCreated}
                onEdited={handleEdited}
                onDeleted={handleDeleted}
                draw={{
                  rectangle: {
                    shapeOptions: {
                      color: selectedColor,
                      fillColor: selectedColor
                    }
                  },
                  polygon: {
                    shapeOptions: {
                      color: selectedColor,
                      fillColor: selectedColor
                    }
                  },
                  circle: {
                    shapeOptions: {
                      color: selectedColor,
                      fillColor: selectedColor
                    }
                  },
                  marker: true,
                  circlemarker: false,
                  polyline: false
                }}
              /> */}
            </FeatureGroup>
          </MapContainer>
        </div>
        
        <div className="p-3 border-t bg-gray-50">
          <div className="text-xs text-gray-500">
            <strong>Instructions:</strong> 
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Select a property type from the buttons above to set the color of your drawing.</li>
              <li>Use the drawing tools on the right side of the map to create shapes.</li>
              <li>For apartment buildings, draw the building outline as a polygon or rectangle.</li>
              <li>For individual plots, draw the exact plot boundaries.</li>
              <li>You can edit or delete shapes using the tools in the toolbar.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
);

AdminPropertyMap.displayName = "AdminPropertyMap";

export default AdminPropertyMap;