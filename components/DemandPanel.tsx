'use client'
import { ApiServices } from "@/lib/apiServices";
import { formatPrice } from "@/lib/data";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PropertyListCard } from "./PropertyListCard";

// const regions = [
//   "Delhi South West",
//   "East Delhi",
//   "North Delhi",
//   "Central Delhi",
//   "South Delhi",
//   "West Delhi",
// ];

type DemandCategory = { name: string; percent: string };
type DemandRegion = {
  Apartment: DemandCategory[];
  Plots: DemandCategory[];
  "Builder Floor": DemandCategory[];
};
type DemandData = { [region: string]: DemandRegion };

const demandData: DemandData = {
  "Delhi South West": {
    Apartment: [
      { name: "Dwarka", percent: "40% Searches" },
      { name: "Sector 14 Dwarka", percent: "4% Searches" },
      { name: "Sector 19 Dwarka", percent: "4% Searches" },
      { name: "Sector 12 Dwarka", percent: "3% Searches" },
      { name: "Sector 6 Dwarka", percent: "3% Searches" },
    ],
    Plots: [
      { name: "Dwarka", percent: "45% Searches" },
      { name: "Sector 19 Dwarka", percent: "5% Searches" },
      { name: "Sector 23 Dwarka", percent: "4% Searches" },
      { name: "Sector 17 Dwarka", percent: "4% Searches" },
      { name: "Sector 8 Dwarka", percent: "4% Searches" },
    ],
    "Builder Floor": [
      { name: "Dwarka", percent: "40% Searches" },
      { name: "Sector 14 Dwarka", percent: "4% Searches" },
      { name: "Sector 19 Dwarka", percent: "4% Searches" },
      { name: "Sector 12 Dwarka", percent: "3% Searches" },
      { name: "Sector 19B Dwarka", percent: "3% Searches" },
    ],
  },
  // Add placeholder data for other regions as needed
};

export default function DemandPanel() {
  const [activeRegion, setActiveRegion] = useState();
  const [regions, setRegions]: any = useState();
  const [propertyLists, setPropertyLists]: any = useState();
  //const data: DemandRegion = demandData[activeRegion] || demandData[regions[0]];
  const data = {};
  const getLocationList = async () => {
    const response = await ApiServices.getDistinctLocationList();
    getPropertyBasedOnRegion(response?.[0]);
    setActiveRegion(response?.[0]);
    setRegions(response)
  }
  const getPropertyBasedOnRegion = async (location: string) => {
    const responseBasedONRegions = await ApiServices.getPropertyBasedOnLocation(location);
    console.log(responseBasedONRegions)
    setPropertyLists(responseBasedONRegions);
  }
  useEffect(() => {
    getLocationList()
  }, [])
  return (
    <div className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="lg:flex items-center mb-6">
          <h2 className="text-2xl font-poppins font-bold text-[#0A3C7D] flex items-center mr-lg-4 mb-3 mb-lg-0">
            Demand in Lucknow
            <span className="ml-2 text-base text-gray-400" title="Where are buyers searching in Delhi?">ℹ️</span>
          </h2>
          <div className="flex gap-2 lg:ml-6 mt-3 md:mt-0 overflow-x-auto">
            {regions && regions?.map((region: any) => (
              <button
                key={region}
                className={`shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeRegion === region ? "bg-[#0A3C7D] text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-100"}`}
                onClick={() => { setActiveRegion(region); getPropertyBasedOnRegion(region) }}
              >
                {region}
              </button>
            ))}
          </div>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {propertyLists && propertyLists?.map((property: any, index: number) => {
            return <PropertyListCard property={property} key={index} />
          })}
          {/* {Object.entries(data).map(([category, list]) => (
            <div key={category} className="bg-[#F6FAFF] rounded-xl shadow p-6 flex flex-col">
              <h3 className="font-semibold text-lg text-[#0A3C7D] mb-4">{category}</h3>
              <ol className="mb-4">
                {(list as DemandCategory[]).map((item: DemandCategory, idx: number) => (
                  <li key={item.name} className="flex items-center mb-2">
                    <span className="font-bold text-primary mr-2">#{idx + 1}</span>
                    <span className="font-medium text-gray-800 mr-2">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.percent}</span>
                  </li>
                ))}
              </ol>
              <button className="text-primary font-medium hover:underline text-sm mt-auto">View all 5 Localities</button>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
} 