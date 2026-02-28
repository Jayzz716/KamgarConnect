'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Star } from 'lucide-react'

// Fix default leaflet icon in Next.js (common issue)
// @ts-expect-error: Leaflet internal property not in types
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type Worker = {
    id: string;
    full_name: string;
    profession: string;
    location: string;
    rating_sum: number;
    rating_count: number;
}

interface WorkerMapProps {
    workers: Worker[];
}

const baseCoordinates: Record<string, [number, number]> = {
    'Mumbai': [19.0760, 72.8777],
    'Pune': [18.5204, 73.8567],
    'Delhi': [28.7041, 77.1025],
    'Bangalore': [12.9716, 77.5946],
    'Chennai': [13.0827, 80.2707],
    'Kolkata': [22.5726, 88.3639],
    'Hyderabad': [17.3850, 78.4867],
    'Nashik': [20.0059, 73.7898],
    'Nagpur': [21.1458, 79.0882],
    'Surat': [21.1702, 72.8311],
    'Ahmedabad': [23.0225, 72.5714],
    'Jaipur': [26.9124, 75.7873],
    'Lucknow': [26.8467, 80.9462],
    'Kanpur': [26.4499, 80.3319],
    'Bhopal': [23.2599, 77.4126],
    'Indore': [22.7196, 75.8577],
    'Patna': [25.5941, 85.1376],
    'Agra': [27.1767, 78.0081],
    'Vadodara': [22.3072, 73.1812],
    'Coimbatore': [11.0168, 76.9558],
    'Visakhapatnam': [17.6868, 83.2185],
    'Kochi': [9.9312, 76.2673],
    'Chandigarh': [30.7333, 76.7794],
    'Guwahati': [26.1445, 91.7362],
    'Bhubaneswar': [20.2961, 85.8245],
    'Thiruvananthapuram': [8.5241, 76.9366],
    'Aurangabad': [19.8762, 75.3433],
    'Solapur': [17.6805, 75.9064],
    'Kolhapur': [16.6970, 74.2238],
    'Amravati': [20.9320, 77.7523],
    'Navi Mumbai': [19.0330, 73.0297],
    'Thane': [19.2183, 72.9781],
    'Unknown': [20.5937, 78.9629]
};


function getRandomOffset(baseCoord: [number, number]): [number, number] {
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    return [baseCoord[0] + latOffset, baseCoord[1] + lngOffset];
}

export default function WorkerMap({ workers }: WorkerMapProps) {
    const [workerMarkers, setWorkerMarkers] = useState<Array<Worker & { position: [number, number] }>>([]);

    useEffect(() => {
        const markers = workers.map(worker => {
            let matchedCity = 'Unknown';
            for (const city of Object.keys(baseCoordinates)) {
                if (worker.location?.toLowerCase().includes(city.toLowerCase())) {
                    matchedCity = city;
                    break;
                }
            }
            const position = getRandomOffset(baseCoordinates[matchedCity]);
            return { ...worker, position };
        });
        setWorkerMarkers(markers);
    }, [workers]);

    const defaultCenter: [number, number] = workerMarkers.length > 0
        ? workerMarkers[0].position
        : [20.5937, 78.9629];
    const defaultZoom = workerMarkers.length > 0 ? 11 : 5;

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                />
                {workerMarkers.map((worker) => (
                    <Marker key={worker.id} position={worker.position}>
                        <Popup>
                            <div className="p-1 min-w-[150px]">
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{worker.full_name}</h3>
                                <p className="text-blue-600 font-semibold text-xs mb-2 bg-blue-50 inline-block px-1.5 py-0.5 rounded border border-blue-100">{worker.profession}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    {worker.rating_count > 0
                                        ? (worker.rating_sum / worker.rating_count).toFixed(1)
                                        : 'New'} Rating · 📍 {worker.location || 'Unknown'}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
