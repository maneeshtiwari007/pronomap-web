import { pgTable, text, serial, integer, boolean, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z, ZodType, ZodObject, any, number } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Property model
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in INR
  pricePerSqFt: integer("price_per_sqft").notNull(),
  propertyType: text("property_type").notNull(), // e.g., "Apartment", "Villa", "Plot", "Shop", "Office"
  propertyStatus: text("property_status").default("Under Construction"), // "Under Construction", "Ready to Move", "Coming Soon"
  location: text("location").notNull(), // e.g., "Gomti Nagar", "Indira Nagar"
  address: text("address").notNull(),
  pincode: text("pincode"), // e.g., "226010", "226016"
  city: text("city").default("Lucknow"), 
  locality: text("locality"),
  landmark: text("landmark"),
  facing: text("facing"), // N, S, E, W, NE, NW, SE, SW
  area: integer("area").notNull(), // in sq.ft
  totalArea: doublePrecision("total_area"), // in acres
  floors: integer("floors").notNull(),
  totalTowers: integer("total_towers"),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  builder: text("builder"), // e.g., "Omaxe", "Shalimar"
  reraNumber: text("rera_number"),
  launchDate: text("launch_date"),
  possessionDate: text("possession_date").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  featuredImage: text("featured_image").notNull(),
  images: text("images").array().notNull(),
  logo: text("logo"),
  brochure: text("brochure"),
  videoLinks: text("video_links").array(),
  virtualTourLink: text("virtual_tour_link"),
  amenities: text("amenities").array(),
  features: jsonb("features"), // parking, clubhouse, power backup, etc.
  isFeatured: boolean("is_featured").default(false).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  tags: text("tags").array(),
  nearbyPlaces: jsonb("nearby_places"),
  unitInventory: jsonb("unit_inventory"), // details of units/apartments/plots
  mapShapes: jsonb("map_shapes"), // drawn shapes on map
  seoMetadata: jsonb("seo_metadata"), // SEO fields
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: text("deleted_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  price:true,
  pricePerSqFt:true,
  area: true,
  bedrooms:true,
  bathrooms: true,
  floors: true,
  latitude: true,
  longitude: true,
  createdAt: true,
  images:true
});

// Nearby places model
export const nearbyPlaces = pgTable("nearby_places", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // e.g., "school", "hospital", "mall"
  distance: doublePrecision("distance").notNull(), // in km
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
});

export const insertNearbyPlaceSchema = createInsertSchema(nearbyPlaces).omit({
  id: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof insertUserSchema;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof insertPropertySchema;

export type NearbyPlace = typeof nearbyPlaces.$inferSelect;
export type InsertNearbyPlace = typeof insertNearbyPlaceSchema;

// Filter types for search
export const propertyFilterSchema = z.object({
  location: z.array(z.string()).optional(),
  propertyType: z.array(z.string()).optional(),
  floor: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
  builder: z.array(z.string()).optional(),
  possessionDate: z.string().optional(),
  bedrooms: z.array(z.string()).optional(),
  keywords: z.string().optional(),
  pincode: z.string().optional(),
  propertyStatus: z.array(z.string()).optional(),
});

export type PropertyFilter = z.infer<typeof propertyFilterSchema>;
