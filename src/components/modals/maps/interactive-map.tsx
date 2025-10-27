"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface User {
  id: string;
  nama: string;
  email: string;
  nomor_telepon: string;
  kelurahan: string;
  rw: string;
  alamat: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface InteractiveMapProps {
  users: User[];
  onUserClick?: (user: User) => void;
}

export function InteractiveMap({ users, onUserClick }: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerClusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    // Initialize map hanya sekali
    if (!mapRef.current) {
      mapRef.current = L.map("interactive-map", {
        center: [-7.0512, 110.4372],
        zoom: 14,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      // Load dan tampilkan GeoJSON untuk batas wilayah
      fetch("/data/banyumanik.geojson")
        .then((response) => response.json())
        .then((data) => {
          if (mapRef.current) {
            // Tambahkan GeoJSON layer dengan styling
            const geoJsonLayer = L.geoJSON(data, {
              style: {
                color: "#10b981",
                fillColor: "#10b981",
                fillOpacity: 0.15,
                weight: 3,
                opacity: 1,
              },
            });
            
            geoJsonLayer.addTo(mapRef.current);
            
            // Fit map ke bounds GeoJSON
            const bounds = geoJsonLayer.getBounds();
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
          }
        })
        .catch((error) => {
          console.error("Error loading GeoJSON:", error);
        });
    }

    // Initialize marker cluster
    if (!markerClusterRef.current && mapRef.current) {
      markerClusterRef.current = L.markerClusterGroup({
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          let className = "marker-cluster-";
          
          if (count < 10) {
            className += "small";
          } else if (count < 50) {
            className += "medium";
          } else {
            className += "large";
          }

          return L.divIcon({
            html: `<div><span>${count}</span></div>`,
            className: `marker-cluster ${className}`,
            iconSize: L.point(40, 40),
          });
        },
      });
      
      mapRef.current.addLayer(markerClusterRef.current);
    }

    // Clear existing markers
    markerClusterRef.current?.clearLayers();

    // Add markers for each user
    users.forEach((user) => {
      if (user.latitude && user.longitude) {
        const marker = L.marker([user.latitude, user.longitude], {
          title: user.nama,
        });

        const displayAddress = user.address || user.alamat || 'Alamat tidak tersedia';
        
        const popupContent = `
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-base mb-2 text-emerald-700">${user.nama}</h3>
            <p class="text-sm text-gray-700 mb-1">
              <strong>Wilayah:</strong> ${user.kelurahan} - ${user.rw}
            </p>
            <p class="text-xs text-gray-600 mb-2">
              ${displayAddress}
            </p>
            <button 
              class="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors user-detail-btn"
              data-user='${JSON.stringify(user)}'
            >
              Lihat Detail
            </button>
          </div>
        `;

        marker.bindPopup(popupContent, {
  maxWidth: 260,
  keepInView: true,
  autoPan: true,
  autoPanPadding: L.point(40, 40),   // ruang kiri/kanan/atas/bawah
  offset: L.point(0, -8),
});

        
        marker.on("popupopen", () => {
          const btn = document.querySelector(".user-detail-btn");
          if (btn) {
            btn.addEventListener("click", () => {
              const userData = btn.getAttribute("data-user");
              if (userData && onUserClick) {
                onUserClick(JSON.parse(userData));
              }
            });
          }
        });

        markerClusterRef.current?.addLayer(marker);
      }
    });
  }, [users, onUserClick]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerClusterRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="interactive-map"
      className="w-full h-full rounded-2xl shadow-lg"
      style={{ minHeight: "500px", zIndex: 1, overflow: "visible" }}
    />
  );
}