import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Asset, Complaint, LanguageMode, PriorityLevel } from '../types';
import {
  MapPin,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Clock,
  QrCode,
  Search,
  Filter,
  Eye,
  Building2,
  ChevronRight,
  Navigation,
  X,
  ShieldCheck,
  Zap,
  Droplets,
  Wrench,
  BarChart3,
  Flame,
  Camera,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface LiveCivicMapFeedProps {
  complaints: Complaint[];
  assets: Asset[];
  lang: LanguageMode;
  onToggleLang: () => void;
  onSelectAsset: (assetId: string) => void;
  onOpenReportModal: () => void;
  onOpenVerifyModal?: (complaint: Complaint) => void;
  onOpenPanchayatDispatch?: (complaintId: string) => void;
  onOpenAnalytics?: () => void;
}

export const LiveCivicMapFeed: React.FC<LiveCivicMapFeedProps> = ({
  complaints = [],
  assets = [],
  lang,
  onToggleLang,
  onSelectAsset,
  onOpenReportModal,
  onOpenVerifyModal,
  onOpenPanchayatDispatch,
  onOpenAnalytics,
}) => {
  // Real-time ticking timestamp for "● LIVE · synced HH:MM:SS"
  const [liveTime, setLiveTime] = useState<string>(() => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter States
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical' | 'Severe' | 'Moderate' | 'Minor'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Resolved'>('All');
  const [wardFilter, setWardFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'split' | 'list' | 'map'>('split');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Map state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeMarkerGrievance, setActiveMarkerGrievance] = useState<Complaint | null>(null);
  const [mapLayer, setMapLayer] = useState<'osm' | 'tactical' | 'satellite'>('osm');

  // Center coordinates of Belavadi Gram Panchayat (Mysuru Rural, Karnataka)
  // Lat: 12.3350, Lng: 76.6350
  const baseCenter = { lat: 12.3350, lng: 76.6350 };
  const geoBounds = {
    minLat: 12.3100,
    maxLat: 12.3600,
    minLng: 76.5950,
    maxLng: 76.6750,
  };

  // Convert severity priority
  const getSeverityLevel = (priority: PriorityLevel | string): 'Critical' | 'Severe' | 'Moderate' | 'Minor' => {
    if (priority === 'Critical') return 'Critical';
    if (priority === 'High') return 'Severe';
    if (priority === 'Medium') return 'Moderate';
    return 'Minor';
  };

  // Filtered complaints list
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const severity = getSeverityLevel(c.priority);
      if (severityFilter !== 'All' && severity !== severityFilter) return false;

      const isResolved = c.status === 'Closed';
      if (statusFilter === 'Active' && isResolved) return false;
      if (statusFilter === 'Resolved' && !isResolved) return false;

      if (wardFilter !== 'All' && c.ward !== wardFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (c.assetName || '').toLowerCase().includes(q);
        const matchesLoc = (c.location || '').toLowerCase().includes(q);
        const matchesId = (c.id || '').toLowerCase().includes(q);
        const matchesWard = (c.ward || '').toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesId && !matchesWard) return false;
      }

      return true;
    });
  }, [complaints, severityFilter, statusFilter, wardFilter, searchQuery]);

  // Metric counts
  const metrics = useMemo(() => {
    const total = complaints.length;
    const active = complaints.filter((c) => c.status !== 'Closed').length;
    const resolved = complaints.filter((c) => c.status === 'Closed').length;
    return { total, active, resolved };
  }, [complaints]);

  // Wards list
  const availableWards = useMemo(() => {
    const set = new Set<string>();
    complaints.forEach((c) => {
      if (c.ward) set.add(c.ward);
    });
    return Array.from(set).sort();
  }, [complaints]);

  // Project Geographic coordinates (Lat/Lng) to SVG canvas coordinate space
  const svgWidth = 900;
  const svgHeight = 620;
  const padding = 50;

  const projectCoordinates = (lat: number, lng: number) => {
    const clampedLat = Math.max(geoBounds.minLat, Math.min(geoBounds.maxLat, lat));
    const clampedLng = Math.max(geoBounds.minLng, Math.min(geoBounds.maxLng, lng));

    const normX = (clampedLng - geoBounds.minLng) / (geoBounds.maxLng - geoBounds.minLng);
    const normY = (geoBounds.maxLat - clampedLat) / (geoBounds.maxLat - geoBounds.minLat);

    const x = padding + normX * (svgWidth - padding * 2);
    const y = padding + normY * (svgHeight - padding * 2);

    return { x, y };
  };

  // Handle zooming & panning
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.7));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveMarkerGrievance(null);
  };

  // Geolocation simulation (Locate Me)
  const handleLocateMe = () => {
    // Center smoothly near main junction
    setZoomLevel(1.6);
    setPanOffset({ x: -40, y: -20 });
  };

  // Hotspot Clusters Calculation for Chennai-style concentric halos
  const hotspotClusters = useMemo(() => {
    // Group active complaints by proximity
    const clusters: Array<{
      x: number;
      y: number;
      count: number;
      highestSeverity: 'Critical' | 'Severe' | 'Moderate' | 'Minor';
      location: string;
    }> = [];

    filteredComplaints.forEach((c) => {
      const lat = c.gpsCoordinates?.lat || baseCenter.lat + (Math.sin(c.id.charCodeAt(c.id.length - 1)) * 0.015);
      const lng = c.gpsCoordinates?.lng || baseCenter.lng + (Math.cos(c.id.charCodeAt(c.id.length - 1)) * 0.025);
      const { x, y } = projectCoordinates(lat, lng);
      const severity = getSeverityLevel(c.priority);

      // Find nearby cluster
      const existing = clusters.find((cl) => Math.hypot(cl.x - x, cl.y - y) < 45);
      if (existing) {
        existing.count += 1;
        if (severity === 'Critical') existing.highestSeverity = 'Critical';
        else if (severity === 'Severe' && existing.highestSeverity !== 'Critical') existing.highestSeverity = 'Severe';
      } else {
        clusters.push({
          x,
          y,
          count: 1,
          highestSeverity: severity,
          location: c.location,
        });
      }
    });

    return clusters;
  }, [filteredComplaints]);

  // Select complaint and pan map
  const handleSelectComplaint = (complaint: Complaint) => {
    setSelectedComplaintId(complaint.id);
    setActiveMarkerGrievance(complaint);

    const lat = complaint.gpsCoordinates?.lat || baseCenter.lat + (Math.sin(complaint.id.charCodeAt(complaint.id.length - 1)) * 0.015);
    const lng = complaint.gpsCoordinates?.lng || baseCenter.lng + (Math.cos(complaint.id.charCodeAt(complaint.id.length - 1)) * 0.025);
    const { x, y } = projectCoordinates(lat, lng);

    // Pan to position
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    setPanOffset({
      x: (centerX - x) * 0.6,
      y: (centerY - y) * 0.6,
    });
    setZoomLevel(1.4);
  };

  // Severity color helpers
  const getSeverityBadgeColor = (severity: 'Critical' | 'Severe' | 'Moderate' | 'Minor') => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Severe':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Moderate':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Minor':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  const getSeverityDotColor = (severity: 'Critical' | 'Severe' | 'Moderate' | 'Minor') => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-600';
      case 'Severe':
        return 'bg-rose-500';
      case 'Moderate':
        return 'bg-amber-500';
      case 'Minor':
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-[calc(100vh-80px)] flex flex-col font-sans">
      {/* 1. TOP CIVIC HEADER BAR (Inspired by Namma Ooru live sync & bilingual filter header) */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-30 shadow-xs px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left Brand & Live Sync Ticker */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {lang === 'kn' ? 'ಗ್ರಾಮ' : 'Grama'}<span className="text-emerald-600">{lang === 'kn' ? 'ಪಾಲ' : 'Pala'}</span>
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hidden sm:inline-block">
                {lang === 'kn' ? 'ಕರ್ನಾಟಕ ಪಂಚಾಯತ್ ರಾಜ್' : 'Karnataka RDPR'}
              </span>
            </div>

            {/* Pulsing Live Heartbeat */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100/90 px-2.5 py-1 rounded-full border border-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-black text-slate-800 tracking-wider text-[11px]">LIVE</span>
              <span className="text-slate-400 font-mono text-[10px]">· synced {liveTime}</span>
            </div>
          </div>

          {/* Right Filters & View Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Language Switcher Pill [EN] [ಕ] */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-xs font-bold">
              <button
                onClick={onToggleLang}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  lang === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={onToggleLang}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
                  lang === 'kn' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ಕ
              </button>
            </div>

            {/* Severity Filter Dropdown */}
            <div className="relative">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                aria-label="Filter grievances by severity"
                className="appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-full pl-3 pr-7 py-1.5 shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Severity</option>
                <option value="Critical">Critical</option>
                <option value="Severe">Severe</option>
                <option value="Moderate">Moderate</option>
                <option value="Minor">Minor</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                aria-label="Filter grievances by status"
                className="appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-full pl-3 pr-7 py-1.5 shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Resolved">Resolved</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>

            {/* Active Reports Pill (Red tag) */}
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              <span>{metrics.active} Active</span>
              <span className="text-rose-400 font-normal">· {metrics.total} Total</span>
            </div>

            {/* View Mode Toggle Buttons (Split / List / Map) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
              <button
                onClick={() => setViewMode('split')}
                title="Split Map and List View"
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>◫</span>
                <span className="hidden sm:inline">Split</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List View Only"
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>≡</span>
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                title="Map View Only"
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🗺️</span>
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN SPLIT INTERFACE (Left Feed & Right GIS Map) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col lg:flex-row gap-4">
        {/* LEFT PANEL: 26 REPORTS & FEED (Collapsible in map-only mode) */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={`${viewMode === 'list' ? 'w-full' : 'w-full lg:w-[420px] shrink-0'} flex flex-col space-y-3.5`}>
            {/* Header & Search Bar */}
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-slate-500 uppercase tracking-wider">
                {filteredComplaints.length} {lang === 'kn' ? 'ವರದಿಗಳು' : 'REPORTS'}
              </div>
              <div className="relative w-48">
                <input
                  type="text"
                  placeholder={lang === 'kn' ? 'ಹುಡುಕಿ...' : 'Search location...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-full pl-7 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            {/* 3 Pastel Summary Stat Tiles (Exact styling match with Namma Ooru) */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Total Card */}
              <div className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-3 text-center transition-transform hover:-translate-y-0.5">
                <div className="text-xl font-black text-rose-700 leading-none">{metrics.total}</div>
                <div className="text-[11px] font-bold text-rose-600/90 mt-1">Total</div>
              </div>

              {/* Active Card */}
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3 text-center transition-transform hover:-translate-y-0.5">
                <div className="text-xl font-black text-amber-700 leading-none">{metrics.active}</div>
                <div className="text-[11px] font-bold text-amber-600/90 mt-1">Active</div>
              </div>

              {/* Resolved Card */}
              <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-3 text-center transition-transform hover:-translate-y-0.5">
                <div className="text-xl font-black text-emerald-700 leading-none">{metrics.resolved}</div>
                <div className="text-[11px] font-bold text-emerald-600/90 mt-1">Resolved</div>
              </div>
            </div>

            {/* Scrollable Report List Feed */}
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredComplaints.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                  No grievances match the selected filters.
                </div>
              ) : (
                filteredComplaints.map((item) => {
                  const severity = getSeverityLevel(item.priority);
                  const isSelected = selectedComplaintId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectComplaint(item)}
                      className={`bg-white rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md hover:-translate-y-0.5 ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-300 bg-emerald-50/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        {/* Title with Left Severity Dot */}
                        <div className="flex items-start space-x-2">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${getSeverityDotColor(severity)}`}></span>
                          <div>
                            <h3 className="text-xs font-black text-slate-900 leading-tight">
                              {item.assetName || item.location}
                            </h3>
                            <div className="flex items-center text-[11px] text-slate-500 mt-1 space-x-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[190px]">{item.location}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-1">
                              {item.reportedAt}
                            </div>
                          </div>
                        </div>

                        {/* Right: Severity Badge & Ward Chevron */}
                        <div className="flex flex-col items-end space-y-1.5 shrink-0">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${getSeverityBadgeColor(severity)}`}>
                            {severity}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 flex items-center">
                            {item.ward || 'Ward 3'} <ChevronRight className="w-3 h-3 text-slate-400" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* RIGHT PANEL: INTERACTIVE REAL-TIME GIS OPENSTREETMAP & CLUSTER RADAR */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col min-h-[520px]">
            {/* Top Floating Badge: "● 26 citizen reports live" (Namma Ooru style) */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-md flex items-center space-x-2 text-xs font-black text-slate-800">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                <span>{filteredComplaints.length} citizen reports live</span>
              </div>
            </div>

            {/* Top-Left Floating LEGEND Overlay (Namma Ooru exact replica) */}
            <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-md text-xs space-y-1.5 min-w-[120px]">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                LEGEND
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span>Minor</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Moderate</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Severe</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span>Critical</span>
              </div>
            </div>

            {/* Map Canvas with OpenStreetMap Base Tiles + Vector GIS Overlays */}
            <div
              className="w-full flex-1 relative bg-[#e5e3df] overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
              }}
              onMouseMove={(e) => {
                if (!isDragging) return;
                setPanOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              {/* OpenStreetMap Stylized Cartography Layer */}
              <div
                className="absolute inset-0 transition-transform duration-75"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                }}
              >
                {/* SVG Vector Overlays */}
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-full"
                  style={{ minWidth: `${svgWidth}px`, minHeight: `${svgHeight}px` }}
                >
                  <defs>
                    {/* Glowing radial gradient for Critical / Severe Hotspot Halos */}
                    <radialGradient id="haloCritical" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity="0.75" />
                      <stop offset="40%" stopColor="#ef4444" stopOpacity="0.45" />
                      <stop offset="80%" stopColor="#f87171" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#fee2e2" stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="haloSevere" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ea580c" stopOpacity="0.7" />
                      <stop offset="45%" stopColor="#f97316" stopOpacity="0.4" />
                      <stop offset="85%" stopColor="#fdba74" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#ffedd5" stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="haloModerate" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#d97706" stopOpacity="0.65" />
                      <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Cartographic Background Grid & Village Geography */}
                  <rect width={svgWidth} height={svgHeight} fill="#f1efe8" />

                  {/* Village Wards Polygons */}
                  <g opacity="0.45">
                    {/* Ward 1 North */}
                    <polygon points="120,80 440,60 480,240 180,270" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6,4" />
                    {/* Ward 2 West */}
                    <polygon points="180,270 480,240 460,490 140,460" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6,4" />
                    {/* Ward 3 Central Bazaar */}
                    <polygon points="480,240 780,210 820,440 460,490" fill="#fef3c7" stroke="#fde68a" strokeWidth="2" strokeDasharray="6,4" />
                    {/* Ward 4 East Agri */}
                    <polygon points="780,210 880,180 920,490 820,440" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="2" strokeDasharray="6,4" />
                  </g>

                  {/* Roads & Transport Arteries */}
                  <g stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
                    <path d="M 80 320 Q 340 310 520 280 T 890 260" fill="none" />
                    <path d="M 520 70 L 520 540" fill="none" />
                    <path d="M 280 120 L 760 480" fill="none" />
                  </g>
                  <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
                    <path d="M 80 320 Q 340 310 520 280 T 890 260" fill="none" />
                    <path d="M 520 70 L 520 540" fill="none" />
                  </g>

                  {/* Ward Labels */}
                  <text x="260" y="180" fill="#64748b" fontSize="12" fontWeight="bold" letterSpacing="1">WARD 1 (NORTH)</text>
                  <text x="240" y="380" fill="#64748b" fontSize="12" fontWeight="bold" letterSpacing="1">WARD 2 (WEST)</text>
                  <text x="610" y="360" fill="#b45309" fontSize="13" fontWeight="900" letterSpacing="1">WARD 3 (BAZAAR)</text>
                  <text x="820" y="320" fill="#047857" fontSize="12" fontWeight="bold" letterSpacing="1">WARD 4 (AGRI)</text>

                  {/* Concentric Cluster Rings (Multi-Layered Halos from Namma Ooru design) */}
                  {hotspotClusters.map((cluster, idx) => {
                    const haloFill =
                      cluster.highestSeverity === 'Critical'
                        ? 'url(#haloCritical)'
                        : cluster.highestSeverity === 'Severe'
                        ? 'url(#haloSevere)'
                        : 'url(#haloModerate)';

                    const baseRadius = cluster.highestSeverity === 'Critical' ? 44 : cluster.highestSeverity === 'Severe' ? 36 : 28;

                    return (
                      <g key={`cluster-${idx}`} className="cursor-pointer">
                        {/* Outer Glow Halo */}
                        <circle
                          cx={cluster.x}
                          cy={cluster.y}
                          r={baseRadius}
                          fill={haloFill}
                          className="animate-pulse"
                        />
                        {/* Inner High-Density Ring */}
                        <circle
                          cx={cluster.x}
                          cy={cluster.y}
                          r={baseRadius * 0.55}
                          fill={cluster.highestSeverity === 'Critical' ? '#dc2626' : '#ea580c'}
                          opacity="0.85"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                        />
                        {/* Hotspot Count Label */}
                        <text
                          x={cluster.x}
                          y={cluster.y + 4}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="11"
                          fontWeight="900"
                        >
                          {cluster.count}
                        </text>
                      </g>
                    );
                  })}

                  {/* Individual Complaint Pins */}
                  {filteredComplaints.map((item) => {
                    const lat = item.gpsCoordinates?.lat || baseCenter.lat + (Math.sin(item.id.charCodeAt(item.id.length - 1)) * 0.015);
                    const lng = item.gpsCoordinates?.lng || baseCenter.lng + (Math.cos(item.id.charCodeAt(item.id.length - 1)) * 0.025);
                    const { x, y } = projectCoordinates(lat, lng);
                    const severity = getSeverityLevel(item.priority);
                    const isSelected = selectedComplaintId === item.id;

                    const pinColor =
                      severity === 'Critical'
                        ? '#dc2626'
                        : severity === 'Severe'
                        ? '#ea580c'
                        : severity === 'Moderate'
                        ? '#d97706'
                        : '#ca8a04';

                    return (
                      <g
                        key={`pin-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectComplaint(item);
                        }}
                        className="cursor-pointer transition-transform hover:scale-125"
                      >
                        {isSelected && (
                          <circle
                            cx={x}
                            cy={y}
                            r="22"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeDasharray="4,2"
                            className="animate-spin"
                          />
                        )}
                        {/* Pin Dot */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? '10' : '7'}
                          fill={pinColor}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Floating Bottom Right Map Controls */}
              <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-2">
                <button
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleLocateMe}
                  title="Locate Me / Center Map"
                  className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4 rotate-45" />
                </button>
                <button
                  onClick={handleReset}
                  title="Reset View"
                  className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Interactive Detail Popover when a grievance marker is selected */}
              {activeMarkerGrievance && (
                <div className="absolute bottom-4 left-4 right-16 sm:right-auto sm:w-80 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-black text-emerald-700">
                        {activeMarkerGrievance.id}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 leading-tight">
                        {activeMarkerGrievance.assetName || activeMarkerGrievance.location}
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveMarkerGrievance(null)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Thumbnail & Description */}
                  <div className="flex space-x-2.5">
                    {activeMarkerGrievance.photoUrl && (
                      <img
                        src={activeMarkerGrievance.photoUrl}
                        alt="Grievance thumbnail"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    )}
                    <div className="text-[11px] text-slate-600 leading-snug">
                      <p className="line-clamp-2">{activeMarkerGrievance.description}</p>
                      <div className="text-[10px] text-slate-400 font-bold mt-1">
                        {activeMarkerGrievance.ward} • {activeMarkerGrievance.reportedAt}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => onSelectAsset(activeMarkerGrievance.assetId)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-1.5 rounded-xl text-center transition-colors cursor-pointer"
                    >
                      Asset Passport
                    </button>
                    {activeMarkerGrievance.status === 'Completed' && onOpenVerifyModal && (
                      <button
                        onClick={() => onOpenVerifyModal(activeMarkerGrievance)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 rounded-xl text-center transition-colors cursor-pointer"
                      >
                        Verify Fix
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Map Attribution */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-1.5 flex items-center justify-between text-[10px] text-slate-500">
              <span>© OpenStreetMap contributors • Belavadi Gram Panchayat GIS</span>
              <span>Karnataka Rural Infrastructure Grid</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. FLOATING GREEN ACTION BAR (Namma Ooru signature bottom pill: [ 📱 Scan QR to Report ] ) */}
      <div className="fixed bottom-4 inset-x-0 z-40 flex items-center justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center space-x-2 bg-slate-900/10 p-1 rounded-full backdrop-blur-xs">
          {/* Main Action Pill Button */}
          <button
            onClick={onOpenReportModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black px-6 sm:px-8 py-3 rounded-full flex items-center space-x-2.5 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer border border-emerald-500"
          >
            <QrCode className="w-5 h-5 text-emerald-100" />
            <span>{lang === 'kn' ? 'QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ವರದಿ ಮಾಡಿ' : 'Scan QR to Report'}</span>
          </button>

          {/* Quick Analytics Button */}
          {onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              title="View Predictive Analytics & Finance Grants"
              className="bg-white hover:bg-slate-100 text-slate-800 p-3 rounded-full border border-slate-200 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
