import React, { useState, useMemo } from 'react';
import { Asset, LanguageMode } from '../types';
import {
  MapPin,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Droplets,
  Zap,
  Building2,
  ExternalLink,
  X,
  Navigation,
  ChevronRight,
  ShieldAlert,
  Info,
  Calendar,
  Eye,
  Filter
} from 'lucide-react';

interface GisVisualMapProps {
  assets: Asset[];
  lang: LanguageMode;
  onSelectAsset: (assetId: string) => void;
  selectedWard?: string;
  onWardChange?: (ward: string) => void;
}

export const GisVisualMap: React.FC<GisVisualMapProps> = ({
  assets = [],
  lang,
  onSelectAsset,
  selectedWard = 'all',
  onWardChange,
}) => {
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'alert' | 'working'>('all');
  const [mapTheme, setMapTheme] = useState<'tactical' | 'topo'>('tactical');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLayerRoads, setShowLayerRoads] = useState<boolean>(true);
  const [showLayerWater, setShowLayerWater] = useState<boolean>(true);
  const [showLayerWards, setShowLayerWards] = useState<boolean>(true);

  // Geographic bounds for Belavadi Gram Panchayat area
  // Lat range: ~12.310 to 12.350 N, Lng range: ~76.605 to 76.680 E
  const bounds = useMemo(() => {
    return {
      minLat: 12.310,
      maxLat: 12.350,
      minLng: 76.605,
      maxLng: 76.680,
    };
  }, []);

  // SVG canvas dimensions
  const svgWidth = 960;
  const svgHeight = 580;
  const padding = 50;

  // Coordinate projection from Lat/Lng to SVG X/Y
  const projectCoordinates = (lat: number, lng: number) => {
    // Clamp to bounds to prevent out-of-bounds rendering
    const clampedLat = Math.max(bounds.minLat, Math.min(bounds.maxLat, lat));
    const clampedLng = Math.max(bounds.minLng, Math.min(bounds.maxLng, lng));

    // lng increases from left to right (X)
    const normX = (clampedLng - bounds.minLng) / (bounds.maxLng - bounds.minLng);
    // lat increases upwards, but SVG Y increases downwards, so invert Y
    const normY = (bounds.maxLat - clampedLat) / (bounds.maxLat - bounds.minLat);

    const x = padding + normX * (svgWidth - padding * 2);
    const y = padding + normY * (svgHeight - padding * 2);

    return { x, y };
  };

  // Filtered assets based on ward and status selection
  const filteredAssets = useMemo(() => {
    return (assets || []).filter((asset) => {
      const matchesWard = selectedWard === 'all' || asset.ward === selectedWard;
      const isAlert = asset.status !== 'Working';
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'alert' && isAlert) ||
        (statusFilter === 'working' && !isAlert);

      return matchesWard && matchesStatus;
    });
  }, [assets, selectedWard, statusFilter]);

  // The currently active / selected asset object
  const activeAsset = useMemo(() => {
    return assets.find((a) => a.id === activeAssetId) || null;
  }, [assets, activeAssetId]);

  // Asset category icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Streetlight':
        return <Zap className="w-3 h-3" />;
      case 'Water Supply':
        return <Droplets className="w-3 h-3" />;
      case 'Borewell Pump':
        return <Wrench className="w-3 h-3" />;
      case 'Rural Road':
        return <Navigation className="w-3 h-3" />;
      case 'Public Toilet':
        return <Building2 className="w-3 h-3" />;
      default:
        return <MapPin className="w-3 h-3" />;
    }
  };

  // Status visual colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical Failure':
        return {
          bg: '#ef4444',
          border: '#b91c1c',
          text: 'text-red-600',
          badgeBg: 'bg-red-500',
          pulse: true,
        };
      case 'Under Repair':
      case 'Degraded':
        return {
          bg: '#f59e0b',
          border: '#d97706',
          text: 'text-amber-600',
          badgeBg: 'bg-amber-500',
          pulse: false,
        };
      case 'Working':
      default:
        return {
          bg: '#10b981',
          border: '#059669',
          text: 'text-emerald-600',
          badgeBg: 'bg-emerald-500',
          pulse: false,
        };
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(1.8, +(z + 0.2).toFixed(1)));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, +(z - 0.2).toFixed(1)));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setActiveAssetId(null);
  };

  const isDark = mapTheme === 'tactical';

  return (
    <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Map Control Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 text-[11px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
              <Compass className="w-3 h-3 text-indigo-600 animate-spin-slow" />
              <span>GIS Spatial Registry</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              {filteredAssets.length} of {assets.length} Assets Mapped
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center space-x-2">
            <span>
              {lang === 'kn'
                ? 'ಗ್ರಾಮ ಪಂಚಾಯತ್ ಆಸ್ತಿಗಳ ನಕ್ಷೆ (ಜಿಐಎಸ್)'
                : 'Belavadi Gram Panchayat Interactive GIS Asset Map'}
            </span>
          </h3>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center text-xs font-bold shadow-2xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('alert')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 ${
                statusFilter === 'alert'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-red-700 hover:bg-red-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-0.5" />
              <span>Alerts</span>
            </button>
            <button
              onClick={() => setStatusFilter('working')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 ${
                statusFilter === 'working'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-0.5" />
              <span>Working</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center text-xs font-bold shadow-2xs">
            <button
              onClick={() => setMapTheme('tactical')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                mapTheme === 'tactical'
                  ? 'bg-indigo-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tactical Night View"
            >
              Dark GIS
            </button>
            <button
              onClick={() => setMapTheme('topo')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                mapTheme === 'topo'
                  ? 'bg-amber-100 text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Topographical Day View"
            >
              Topo Light
            </button>
          </div>

          {/* Layer toggles dropdown/pills */}
          <div className="hidden sm:flex items-center space-x-1 bg-white border border-slate-200 rounded-xl px-2 py-1 text-[11px] font-bold text-slate-600">
            <Layers className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <label className="flex items-center space-x-1 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={showLayerRoads}
                onChange={(e) => setShowLayerRoads(e.target.checked)}
                className="w-3 h-3 text-indigo-600 rounded"
              />
              <span>Roads</span>
            </label>
            <span className="text-slate-300">|</span>
            <label className="flex items-center space-x-1 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={showLayerWater}
                onChange={(e) => setShowLayerWater(e.target.checked)}
                className="w-3 h-3 text-blue-600 rounded"
              />
              <span>Canals</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative w-full overflow-hidden select-none bg-slate-950 min-h-[460px] sm:min-h-[520px]">
        {/* SVG Map Canvas */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full max-h-[580px]"
            style={{
              backgroundColor: isDark ? '#090d16' : '#f8fafc',
            }}
          >
            <defs>
              {/* Pattern for background GIS grid */}
              <pattern
                id="gis-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                  strokeWidth="1"
                />
              </pattern>

              {/* Agricultural texture pattern */}
              <pattern
                id="agri-hatch"
                width="20"
                height="20"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="20"
                  stroke={isDark ? 'rgba(16,185,129,0.04)' : 'rgba(5,150,105,0.06)'}
                  strokeWidth="2"
                />
              </pattern>

              {/* Radial glow for selected asset */}
              <radialGradient id="marker-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Grid */}
            <rect width="100%" height="100%" fill="url(#gis-grid)" />

            {/* Ward Zones Demarcation Polygons (Ward 1, Ward 2, Ward 3, Ward 4) */}
            {showLayerWards && (
              <g id="ward-zones" className="transition-opacity duration-300">
                {/* Ward 1 - Northwest Agricultural & Borewell Zone */}
                <path
                  d="M 60 60 L 460 60 L 430 290 L 70 270 Z"
                  fill={isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.04)'}
                  stroke={isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.3)'}
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                <text
                  x="100"
                  y="95"
                  fill={isDark ? '#818cf8' : '#4f46e5'}
                  fontSize="12"
                  fontWeight="800"
                  letterSpacing="1"
                  opacity="0.8"
                >
                  WARD 1 • HUNSUR BYPASS & AGRI BELT
                </text>

                {/* Ward 2 - Northeast Water Supply Zone */}
                <path
                  d="M 480 60 L 900 60 L 890 270 L 450 280 Z"
                  fill={isDark ? 'rgba(14, 165, 233, 0.05)' : 'rgba(14, 165, 233, 0.04)'}
                  stroke={isDark ? 'rgba(14, 165, 233, 0.25)' : 'rgba(14, 165, 233, 0.3)'}
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                <text
                  x="510"
                  y="95"
                  fill={isDark ? '#38bdf8' : '#0284c7'}
                  fontSize="12"
                  fontWeight="800"
                  letterSpacing="1"
                  opacity="0.8"
                >
                  WARD 2 • JAL NIGAM MAIN PIPELINE SECTOR
                </text>

                {/* Ward 3 - Central & Southwest Gramatana (Village Center) */}
                <path
                  d="M 70 290 L 460 300 L 480 520 L 80 520 Z"
                  fill={isDark ? 'rgba(245, 158, 11, 0.05)' : 'rgba(245, 158, 11, 0.04)'}
                  stroke={isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.3)'}
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                <text
                  x="100"
                  y="330"
                  fill={isDark ? '#fbbf24' : '#d97706'}
                  fontSize="12"
                  fontWeight="800"
                  letterSpacing="1"
                  opacity="0.8"
                >
                  WARD 3 • BELAVADI GRAMA TANA & BAZAAR
                </text>

                {/* Ward 4 - Southeast Chamundi Rural Link Corridor */}
                <path
                  d="M 480 300 L 900 290 L 890 520 L 500 520 Z"
                  fill={isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.04)'}
                  stroke={isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.3)'}
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                <text
                  x="530"
                  y="330"
                  fill={isDark ? '#34d399' : '#059669'}
                  fontSize="12"
                  fontWeight="800"
                  letterSpacing="1"
                  opacity="0.8"
                >
                  WARD 4 • CHAMUNDI RURAL APPROACH CORRIDOR
                </text>
              </g>
            )}

            {/* Water Bodies & Irrigation Canals */}
            {showLayerWater && (
              <g id="water-features">
                {/* Belavadi Lake / Kere (North-East water reservoir) */}
                <path
                  d="M 680 130 C 720 110, 810 120, 830 170 C 840 210, 780 240, 720 230 C 670 220, 650 160, 680 130 Z"
                  fill={isDark ? '#0c4a6e' : '#bae6fd'}
                  stroke={isDark ? '#0284c7' : '#38bdf8'}
                  strokeWidth="2"
                  opacity={isDark ? '0.7' : '0.8'}
                />
                <text
                  x="730"
                  y="180"
                  fill={isDark ? '#7dd3fc' : '#0369a1'}
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  Belavadi Kere
                </text>

                {/* Cauvery Tributary Canal Flow Line */}
                <path
                  d="M 50 180 C 220 190, 380 230, 480 240 C 620 250, 740 320, 910 340"
                  fill="none"
                  stroke={isDark ? '#0284c7' : '#0284c7'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="8,4"
                  opacity={isDark ? '0.6' : '0.7'}
                />
                <text
                  x="280"
                  y="215"
                  fill={isDark ? '#38bdf8' : '#0284c7'}
                  fontSize="9"
                  fontWeight="600"
                  transform="rotate(6, 280, 215)"
                >
                  Cauvery Sub-Canal ➔
                </text>
              </g>
            )}

            {/* Road Network & Corridors */}
            {showLayerRoads && (
              <g id="road-network">
                {/* State Highway SH-88 (Major East-West Artery) */}
                <path
                  d="M 50 280 L 460 285 L 910 270"
                  fill="none"
                  stroke={isDark ? '#1e293b' : '#cbd5e1'}
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 50 280 L 460 285 L 910 270"
                  fill="none"
                  stroke={isDark ? '#f59e0b' : '#f59e0b'}
                  strokeWidth="2"
                  strokeDasharray="8,8"
                />
                <text
                  x="200"
                  y="273"
                  fill={isDark ? '#fde68a' : '#b45309'}
                  fontSize="9"
                  fontWeight="800"
                >
                  STATE HIGHWAY SH-88 (HUNSUR-MYSURU)
                </text>

                {/* Belavadi Main Bazaar Cross-Road (North-South) */}
                <path
                  d="M 460 60 L 460 285 L 470 520"
                  fill="none"
                  stroke={isDark ? '#334155' : '#e2e8f0'}
                  strokeWidth="7"
                />
                <path
                  d="M 460 60 L 460 285 L 470 520"
                  fill="none"
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  strokeWidth="1.5"
                  strokeDasharray="6,6"
                />
                <text
                  x="475"
                  y="400"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                  fontSize="9"
                  fontWeight="700"
                  transform="rotate(90, 475, 400)"
                >
                  BELAVADI MAIN ROAD
                </text>

                {/* Chamundi Link Road Corridor */}
                <path
                  d="M 470 380 Q 640 370 820 480"
                  fill="none"
                  stroke={isDark ? '#334155' : '#e2e8f0'}
                  strokeWidth="6"
                />
                <text
                  x="640"
                  y="415"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                  fontSize="9"
                  fontWeight="700"
                >
                  Chamundi Link km 2.4
                </text>
              </g>
            )}

            {/* Geographic Landmark Nodes */}
            <g id="landmarks">
              {/* Gram Panchayat Bhavan */}
              <g transform="translate(435, 295)">
                <rect
                  x="-12"
                  y="-12"
                  width="24"
                  height="24"
                  rx="6"
                  fill={isDark ? '#312e81' : '#e0e7ff'}
                  stroke={isDark ? '#6366f1' : '#4f46e5'}
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="0" r="3" fill="#6366f1" />
                <text
                  x="18"
                  y="4"
                  fill={isDark ? '#e0e7ff' : '#1e1b4b'}
                  fontSize="10"
                  fontWeight="800"
                >
                  Panchayat Bhavan
                </text>
              </g>

              {/* Maramma Temple (Ward 2) */}
              <g transform="translate(560, 210)">
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill={isDark ? '#78350f' : '#fef3c7'}
                  stroke="#d97706"
                  strokeWidth="1.5"
                />
                <text
                  x="10"
                  y="3"
                  fill={isDark ? '#fcd34d' : '#92400e'}
                  fontSize="9"
                  fontWeight="700"
                >
                  Maramma Temple
                </text>
              </g>

              {/* Govt Higher Primary School (Ward 3) */}
              <g transform="translate(360, 330)">
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill={isDark ? '#064e3b' : '#d1fae5'}
                  stroke="#059669"
                  strokeWidth="1.5"
                />
                <text
                  x="-8"
                  y="18"
                  fill={isDark ? '#6ee7b7' : '#065f46'}
                  fontSize="9"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  Govt Primary School
                </text>
              </g>
            </g>

            {/* Interactive Asset Markers */}
            <g id="asset-markers">
              {filteredAssets.map((asset) => {
                const { x, y } = projectCoordinates(
                  asset.coordinates.lat,
                  asset.coordinates.lng
                );
                const isSelected = activeAssetId === asset.id;
                const isHovered = hoveredAssetId === asset.id;
                const statusStyle = getStatusColor(asset.status);
                const isAlert = asset.status !== 'Working';

                return (
                  <g
                    key={asset.id}
                    transform={`translate(${x}, ${y})`}
                    className="cursor-pointer transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAssetId(asset.id);
                    }}
                    onMouseEnter={() => setHoveredAssetId(asset.id)}
                    onMouseLeave={() => setHoveredAssetId(null)}
                  >
                    {/* Concentric Selection Halo */}
                    {isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="32"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeDasharray="4,4"
                        className="animate-spin-slow"
                        opacity="0.9"
                      />
                    )}

                    {/* Radar Pulse Animation for Critical Failure / Alert Assets */}
                    {statusStyle.pulse && (
                      <circle
                        cx="0"
                        cy="0"
                        r="22"
                        fill="none"
                        stroke={statusStyle.bg}
                        strokeWidth="2"
                        opacity="0.75"
                      >
                        <animate
                          attributeName="r"
                          from="14"
                          to="28"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.8"
                          to="0"
                          dur="1.8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Outer Pin Halo on Hover */}
                    {isHovered && !isSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="20"
                        fill={statusStyle.bg}
                        opacity="0.25"
                      />
                    )}

                    {/* Marker Pin Base Shadow */}
                    <ellipse
                      cx="0"
                      cy="15"
                      rx="8"
                      ry="3.5"
                      fill="rgba(0,0,0,0.4)"
                    />

                    {/* Pin Background Shape */}
                    <path
                      d="M 0 14 C -12 2, -14 -8, 0 -18 C 14 -8, 12 2, 0 14 Z"
                      fill={statusStyle.bg}
                      stroke={isSelected ? '#ffffff' : statusStyle.border}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      filter="drop-shadow(0px 3px 4px rgba(0,0,0,0.35))"
                    />

                    {/* Center Circular Icon Disc */}
                    <circle cx="0" cy="-5" r="7.5" fill="#ffffff" />

                    {/* Category Graphic / Letter Mark */}
                    <g
                      transform="translate(-4, -9) scale(0.65)"
                      className="text-slate-900"
                    >
                      {asset.category === 'Streetlight' ? (
                        <path
                          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                          fill="#d97706"
                        />
                      ) : asset.category === 'Water Supply' ? (
                        <path
                          d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                          fill="#0284c7"
                        />
                      ) : asset.category === 'Borewell Pump' ? (
                        <path
                          d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                          fill="#4f46e5"
                        />
                      ) : asset.category === 'Rural Road' ? (
                        <path d="M3 11l19-9-9 19-2-8-8-2z" fill="#059669" />
                      ) : (
                        <path
                          d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"
                          fill="#9333ea"
                        />
                      )}
                    </g>

                    {/* Lemon Asset Indicator Badge (if broken 3+ times under warranty) */}
                    {asset.isLemonAsset && (
                      <g transform="translate(7, -19)">
                        <circle cx="0" cy="0" r="5" fill="#facc15" stroke="#713f12" strokeWidth="1" />
                        <text
                          x="0"
                          y="3"
                          fill="#713f12"
                          fontSize="7"
                          fontWeight="900"
                          textAnchor="middle"
                        >
                          !
                        </text>
                      </g>
                    )}

                    {/* Label Tag below Marker */}
                    <g transform="translate(0, 26)">
                      <rect
                        x="-38"
                        y="-7"
                        width="76"
                        height="14"
                        rx="4"
                        fill={isDark ? '#0f172a' : '#ffffff'}
                        stroke={isSelected ? '#6366f1' : isDark ? '#334155' : '#cbd5e1'}
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text
                        x="0"
                        y="3"
                        fill={isSelected ? '#6366f1' : isDark ? '#e2e8f0' : '#1e293b'}
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {asset.id.replace('KA-MYS-', '')}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Compass Rose in Top-Right Corner */}
            <g transform="translate(910, 50)" opacity="0.85">
              <circle
                cx="0"
                cy="0"
                r="22"
                fill={isDark ? '#0f172a' : '#ffffff'}
                stroke={isDark ? '#334155' : '#e2e8f0'}
                strokeWidth="1.5"
              />
              {/* North Arrow */}
              <polygon points="0,-16 5,0 0,-4 -5,0" fill="#ef4444" />
              {/* South Arrow */}
              <polygon points="0,16 5,0 0,4 -5,0" fill={isDark ? '#64748b' : '#94a3b8'} />
              <text
                x="0"
                y="-6"
                fill="#ef4444"
                fontSize="9"
                fontWeight="900"
                textAnchor="middle"
              >
                N
              </text>
            </g>

            {/* Map Scale Bar in Bottom-Left Corner */}
            <g transform="translate(30, 550)" opacity="0.85">
              <rect
                x="0"
                y="-18"
                width="140"
                height="24"
                rx="6"
                fill={isDark ? '#0f172a' : '#ffffff'}
                stroke={isDark ? '#334155' : '#e2e8f0'}
                strokeWidth="1"
              />
              <line
                x1="15"
                y1="-6"
                x2="125"
                y2="-6"
                stroke={isDark ? '#cbd5e1' : '#475569'}
                strokeWidth="2"
              />
              <line
                x1="15"
                y1="-10"
                x2="15"
                y2="-2"
                stroke={isDark ? '#cbd5e1' : '#475569'}
                strokeWidth="2"
              />
              <line
                x1="125"
                y1="-10"
                x2="125"
                y2="-2"
                stroke={isDark ? '#cbd5e1' : '#475569'}
                strokeWidth="2"
              />
              <text
                x="70"
                y="-9"
                fill={isDark ? '#cbd5e1' : '#475569'}
                fontSize="8"
                fontFamily="monospace"
                fontWeight="700"
                textAnchor="middle"
              >
                500 METERS
              </text>
            </g>

            {/* GPS Latitude/Longitude Boundary Reference Ticks */}
            <g opacity="0.6">
              <text
                x="15"
                y="65"
                fill={isDark ? '#64748b' : '#94a3b8'}
                fontSize="8"
                fontFamily="monospace"
              >
                12.350° N
              </text>
              <text
                x="15"
                y="535"
                fill={isDark ? '#64748b' : '#94a3b8'}
                fontSize="8"
                fontFamily="monospace"
              >
                12.310° N
              </text>
              <text
                x="70"
                y="570"
                fill={isDark ? '#64748b' : '#94a3b8'}
                fontSize="8"
                fontFamily="monospace"
              >
                76.605° E
              </text>
              <text
                x="850"
                y="570"
                fill={isDark ? '#64748b' : '#94a3b8'}
                fontSize="8"
                fontFamily="monospace"
              >
                76.680° E
              </text>
            </g>
          </svg>
        </div>

        {/* Float Controls: Zoom In / Zoom Out / Reset */}
        <div className="absolute top-4 left-4 z-20 flex flex-col space-y-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset map view"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hover Tooltip (Quick Preview) */}
        {hoveredAssetId && !activeAsset && (
          (() => {
            const hAsset = assets.find((a) => a.id === hoveredAssetId);
            if (!hAsset) return null;
            return (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 text-white backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-slate-700 text-xs flex items-center space-x-3 pointer-events-none animate-in fade-in">
                <span className="font-mono text-amber-400 font-bold">{hAsset.id}</span>
                <span className="text-slate-400">•</span>
                <span className="font-bold truncate max-w-[200px]">{hAsset.name}</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    hAsset.status === 'Working'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {hAsset.status}
                </span>
                <span className="text-[10px] text-slate-400">Click marker for details</span>
              </div>
            );
          })()
        )}

        {/* Selected Asset Interactive Detail Drawer / Popover Card */}
        {activeAsset && (
          <div className="absolute top-4 right-4 z-30 w-full max-w-sm bg-white/98 dark:bg-slate-900/98 backdrop-blur-md rounded-3xl border-2 border-indigo-500/40 shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                    {activeAsset.id}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                    {activeAsset.ward}
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                  {activeAsset.name}
                </h4>
              </div>

              <button
                onClick={() => setActiveAssetId(null)}
                aria-label="Close detail card"
                className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Info */}
            <div className="p-4 space-y-3.5 text-xs overflow-y-auto max-h-[380px]">
              {/* Status and Health Banner */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  {activeAsset.status === 'Working' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400">Current Health</div>
                    <div className="font-extrabold text-slate-900 dark:text-white">
                      {activeAsset.status}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400">Category</div>
                  <div className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
                    {getCategoryIcon(activeAsset.category)}
                    <span>{activeAsset.category}</span>
                  </div>
                </div>
              </div>

              {/* Lemon Asset Warning Banner */}
              {activeAsset.isLemonAsset && (
                <div className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start space-x-2.5 text-red-900 dark:text-red-300">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <span className="font-black uppercase">Lemon Asset Detected:</span>{' '}
                    Flagged with {activeAsset.failureCount} recurring breakdowns under contractor warranty.
                  </div>
                </div>
              )}

              {/* Location Property */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  <span>Physical Location & GPS Coordinates</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-xs leading-snug">
                    {activeAsset.location || `${activeAsset.ward}, ${activeAsset.panchayat}`}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                    {activeAsset.coordinates.lat.toFixed(4)}° N, {activeAsset.coordinates.lng.toFixed(4)}° E
                  </p>
                </div>
              </div>

              {/* Warranty & Contractor Info */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px] font-bold">Contractor</span>
                  <p className="font-extrabold text-slate-900 dark:text-white truncate" title={activeAsset.contractor}>
                    {activeAsset.contractor}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px] font-bold">Warranty Status</span>
                  <p className={`font-extrabold ${activeAsset.isUnderWarranty ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {activeAsset.isUnderWarranty ? 'Active Warranty' : 'Warranty Expired'}
                  </p>
                </div>
              </div>

              {/* Maintenance Metrics */}
              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 border-t border-slate-100 dark:border-slate-800">
                <span>Total Repairs: <strong className="text-slate-800 dark:text-slate-200">{activeAsset.repairHistory.length}</strong></span>
                <span>Failure Count: <strong className="text-red-600">{activeAsset.failureCount}</strong></span>
                <span>Installed: <strong className="text-slate-800 dark:text-slate-200">{activeAsset.installationDate}</strong></span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-3 bg-slate-50/90 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
              <button
                onClick={() => onSelectAsset(activeAsset.id)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20"
              >
                <span>Open Full Asset Passport</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Quick-Select Strip of Mapped Assets */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-red-600" />
          <span>Quick Select Asset on Map:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {filteredAssets.map((asset) => {
            const isSelected = activeAssetId === asset.id;
            const isWorking = asset.status === 'Working';

            return (
              <button
                key={asset.id}
                onClick={() => setActiveAssetId(asset.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isWorking ? 'bg-emerald-500' : 'bg-red-500 animate-ping'
                  }`}
                />
                <span>{asset.id}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
