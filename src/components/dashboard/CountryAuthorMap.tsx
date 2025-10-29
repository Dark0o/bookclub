"use client";

import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthorCard, type Author } from "./AuthorCard";
import "leaflet/dist/leaflet.css";
import type { GeoJsonObject, Feature } from "geojson";
import L from "leaflet";

// Component to update map view dynamically
function MapViewController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, {
      animate: true,
      duration: 1.5,
    });
  }, [center, zoom, map]);

  return null;
}

export function CountryAuthorMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  // Load GeoJSON data
  useEffect(() => {
    fetch("/countries.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Failed to load GeoJSON:", err));
  }, []);

  const handleCountryClick = useCallback(async (countryName: string) => {
    setSelectedCountry(countryName);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/open-library/authors?q=${encodeURIComponent(countryName)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch authors");
      }

      const data = await response.json();
      setAuthors(data.authors);
    } catch (err) {
      setError("Failed to load authors for this country.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's location and set default country
  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use Nominatim reverse geocoding to get country
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3`
          );

          if (!response.ok) {
            throw new Error("Failed to get location");
          }

          const data = await response.json();
          const country = data.address?.country;

          if (country) {
            // Center map on user's location
            setMapCenter([latitude, longitude]);
            setMapZoom(6);

            // Select the country and load authors
            handleCountryClick(country);
          }
        } catch (err) {
          console.error("Failed to reverse geocode location:", err);
        }
      },
      (error) => {
        console.log("Geolocation permission denied or unavailable:", error);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, [handleCountryClick]);

  const handleClearSelection = () => {
    setSelectedCountry(null);
    setAuthors([]);
    setError(null);
  };

  // Style function for countries
  const countryStyle = (feature?: Feature) => {
    const isSelected = feature?.properties?.name === selectedCountry;
    return {
      fillColor: isSelected ? "#3b82f6" : "#e5e7eb",
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: isSelected ? 0.7 : 0.5,
    };
  };

  // Handle mouse events
  const onEachCountry = (feature: Feature, layer: L.Layer) => {
    const countryName = feature.properties?.name;

    // Popup
    layer.bindPopup(
      `<strong>${countryName}</strong><br/>Click to discover authors`
    );

    // Mouse events
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        if (feature.properties?.name !== selectedCountry) {
          layer.setStyle({
            fillColor: "#9ca3af",
            fillOpacity: 0.7,
          });
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        if (feature.properties?.name !== selectedCountry) {
          layer.setStyle({
            fillColor: "#e5e7eb",
            fillOpacity: 0.5,
          });
        }
      },
      click: () => {
        if (countryName) handleCountryClick(countryName);
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Discover Authors by Country</CardTitle>
            {selectedCountry && (
              <Button
                onClick={handleClearSelection}
                variant="outline"
                size="sm"
              >
                Clear Selection
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] rounded-lg overflow-hidden border">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              minZoom={1}
              maxZoom={6}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <MapViewController center={mapCenter} zoom={mapZoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {geoData && (
                <GeoJSON
                  key={selectedCountry || "default"}
                  data={geoData}
                  style={countryStyle}
                  onEachFeature={onEachCountry}
                />
              )}
            </MapContainer>
          </div>

          {selectedCountry && (
            <div className="mt-4 p-3 bg-primary/10 rounded-md">
              <p className="text-sm font-medium">
                Selected:{" "}
                <span className="text-primary">{selectedCountry}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <p className="text-center text-muted-foreground">
          Loading authors from {selectedCountry}...
        </p>
      )}

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {!loading && selectedCountry && authors.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">
            Authors from {selectedCountry} ({authors.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authors.map((author) => (
              <AuthorCard key={author.key} author={author} />
            ))}
          </div>
        </div>
      )}

      {!loading && selectedCountry && authors.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No authors found for {selectedCountry}. Try another country!
        </p>
      )}
    </div>
  );
}
