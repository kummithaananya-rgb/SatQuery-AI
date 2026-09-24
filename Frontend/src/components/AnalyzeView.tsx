import React, { useState, useRef, useEffect } from 'react';
import { SatelliteSample, GroundedObject } from '../types';
import { SATELLITE_SAMPLES } from '../data/samples';
import { 
  Upload, Search, Crosshair, Sliders, Layers, Download, 
  RefreshCw, CheckCircle2, AlertCircle, Eye, ZoomIn, ZoomOut, 
  Compass, Maximize2, Shield, Sparkles
} from 'lucide-react';

interface AnalyzeViewProps {
  initialModality?: 'Optical' | 'SAR' | 'Multispectral' | 'Change Detection';
}

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({ initialModality }) => {
  // Select active sample
  const [selectedSample, setSelectedSample] = useState<SatelliteSample>(() => {
    if (initialModality) {
      const match = SATELLITE_SAMPLES.find(s => s.modality === initialModality);
      if (match) return match;
    }
    return SATELLITE_SAMPLES[0];
  });

  // Query state
  const [queryText, setQueryText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [analysisCompleted, setAnalysisCompleted] = useState(false);

  // Viewport states
  const [bandPreset, setBandPreset] = useState<'rgb' | 'cir' | 'ndvi' | 'sar'>('rgb');
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mouseCoords, setMouseCoords] = useState({ lat: '43.5701°N', lon: '4.7082°E', utm: '31T 638042mE 4825310mN' });
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [selectedDetection, setSelectedDetection] = useState<GroundedObject | null>(null);

  // Upload state
  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  // Grounded objects output state
  const [detections, setDetections] = useState<GroundedObject[]>([]);

  // Update sample when modality changes from parent
  useEffect(() => {
    if (initialModality) {
      const match = SATELLITE_SAMPLES.find(s => s.modality === initialModality);
      if (match) setSelectedSample(match);
    }
  }, [initialModality]);

  // Handle canvas mouse move for realistic telemetry coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasContainerRef.current) return;
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    // Calculate approximate coordinates based on selected sample
    const baseLat = selectedSample.id === 'sar-harbor-02' ? 51.95 : selectedSample.id === 'chg-reservoir-03' ? 36.02 : 43.57;
    const baseLon = selectedSample.id === 'sar-harbor-02' ? 4.29 : selectedSample.id === 'chg-reservoir-03' ? -114.74 : 4.70;
    
    const curLat = (baseLat + (0.5 - y) * 0.08).toFixed(4);
    const curLon = (baseLon + (x - 0.5) * 0.09).toFixed(4);

    setMouseCoords({
      lat: `${curLat}°${Number(curLat) >= 0 ? 'N' : 'S'}`,
      lon: `${Math.abs(Number(curLon)).toFixed(4)}°${Number(curLon) >= 0 ? 'E' : 'W'}`,
      utm: `UTM Zone 31T · ${(600000 + x * 25000).toFixed(0)}mE ${(4800000 + y * 25000).toFixed(0)}mN`
    });
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
          setAnalysisCompleted(false);
          setDetections([]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Execute Analysis Pipeline
  const handleRunAnalysis = () => {
    if (!queryText.trim()) return;

    setIsProcessing(true);
    setAnalysisCompleted(false);
    setDetections([]);
    setSelectedDetection(null);

    // Realistic multi-stage telemetry pipeline
    setProcessStep('Radiometric calibration & CRS alignment...');
    setTimeout(() => {
      setProcessStep('Tokenizing prompt & cross-modal geospatial embedding...');
      setTimeout(() => {
        setProcessStep('Vision-Language spatial grounding & mask delineation...');
        setTimeout(() => {
          setIsProcessing(false);
          setAnalysisCompleted(true);
          
          // Generate authentic grounded objects tailored to the active scene and query
          if (selectedSample.id === 'sar-harbor-02') {
            setDetections([
              {
                id: 'DET-01',
                label: 'Container Cargo Vessel (Class A)',
                confidence: 96.4,
                bbox: [24, 38, 16, 12],
                coordinates: '51°55\'42"N, 4°17\'11"E',
                areaEstimate: '18,400 m²',
                spectralSignature: 'Backscatter Sigma-0: -3.8 dB (High metallic return)'
              },
              {
                id: 'DET-02',
                label: 'Panamax Bulk Carrier',
                confidence: 93.1,
                bbox: [58, 22, 14, 10],
                coordinates: '51°56\'08"N, 4°18\'49"E',
                areaEstimate: '14,200 m²',
                spectralSignature: 'Backscatter Sigma-0: -5.2 dB (Structured hull scatter)'
              },
              {
                id: 'DET-03',
                label: 'Offshore Service Tug',
                confidence: 89.7,
                bbox: [72, 60, 9, 8],
                coordinates: '51°54\'59"N, 4°19\'33"E',
                areaEstimate: '2,800 m²',
                spectralSignature: 'Backscatter Sigma-0: -10.4 dB (Moderate return)'
              }
            ]);
          } else if (selectedSample.id === 'chg-reservoir-03') {
            setDetections([
              {
                id: 'DET-01',
                label: 'Exposed Bathymetric Bedrock Island',
                confidence: 94.8,
                bbox: [32, 44, 22, 18],
                coordinates: '36°01\'33"N, 114°44\'02"W',
                areaEstimate: '0.84 km²',
                spectralSignature: 'MNDWI: -0.42 (Transition to bare arid mineral)'
              },
              {
                id: 'DET-02',
                label: 'Receded High-Water Mark Margin',
                confidence: 91.5,
                bbox: [62, 30, 20, 24],
                coordinates: '36°02\'11"N, 114°43\'18"W',
                areaEstimate: '1.65 km²',
                spectralSignature: 'SWIR1/SWIR2 Albedo delta: +38.2%'
              }
            ]);
          } else {
            setDetections([
              {
                id: 'DET-01',
                label: 'High-Density Irrigated Crop Parcel',
                confidence: 97.2,
                bbox: [18, 25, 26, 22],
                coordinates: '43°34\'44"N, 4°42\'10"E',
                areaEstimate: '34.8 Hectares',
                spectralSignature: 'NDVI: 0.82 (Dense vigorous vegetative canopy)'
              },
              {
                id: 'DET-02',
                label: 'Alluvial Drainage Canal Confluence',
                confidence: 94.0,
                bbox: [52, 48, 18, 28],
                coordinates: '43°33\'58"N, 4°43\'05"E',
                areaEstimate: '12.4 km linear reach',
                spectralSignature: 'NDWI: +0.64 (High turbidity aquatic boundary)'
              },
              {
                id: 'DET-03',
                label: 'Fallow Parcel with Low Canopy Moisture',
                confidence: 88.9,
                bbox: [72, 15, 20, 19],
                coordinates: '43°35\'12"N, 4°44\'20"E',
                areaEstimate: '22.1 Hectares',
                spectralSignature: 'NDVI: 0.28 (Sparse dry stubble cover)'
              }
            ]);
          }
        }, 800);
      }, 700);
    }, 600);
  };

  // Export GeoJSON
  const handleExportGeoJSON = () => {
    const geojsonData = {
      type: 'FeatureCollection',
      metadata: {
        mission: 'SatQuery AI Analysis Pass',
        sensor: selectedSample.sensor,
        acquisition: selectedSample.acquisitionDate,
        crs: selectedSample.crs,
        query: queryText,
        timestamp: new Date().toISOString()
      },
      features: detections.map(d => ({
        type: 'Feature',
        properties: {
          id: d.id,
          label: d.label,
          confidence: d.confidence,
          area: d.areaEstimate,
          signature: d.spectralSignature
        },
        geometry: {
          type: 'Point',
          coordinates: d.coordinates
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satquery-${selectedSample.id}-grounding.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeImage = customImage || selectedSample.imageUrl;

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col">
      
      {/* Top Console Telemetry Ribbon */}
      <div className="border-b border-white/10 bg-[#090e1c] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">SATELLITE WORKBENCH</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-cyan-400 hidden sm:inline">{selectedSample.sensor}</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">{selectedSample.crs}</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 tabular-nums">
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-200">{mouseCoords.lat}, {mouseCoords.lon}</span>
          </div>
          <span className="text-slate-600 hidden lg:inline">|</span>
          <span className="hidden lg:inline text-purple-400">{mouseCoords.utm}</span>
        </div>
      </div>

      {/* Main Workspace Split Console */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sample Switcher & Parameter Controls (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Active Target Selector */}
          <div className="rounded-2xl p-5 glass-panel border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-slate-400 font-medium">
                Remote Sensing Dataset
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {selectedSample.modality}
              </span>
            </div>

            <div className="space-y-2">
              {SATELLITE_SAMPLES.map((sample) => {
                const isCurrent = !customImage && selectedSample.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setCustomImage(null);
                      setSelectedSample(sample);
                      setAnalysisCompleted(false);
                      setDetections([]);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isCurrent
                        ? 'border-cyan-500/60 bg-cyan-500/10 text-white shadow-sm'
                        : 'border-white/5 bg-white/5 hover:border-white/15 text-slate-300'
                    }`}
                  >
                    <img
                      src={sample.imageUrl}
                      alt={sample.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold truncate text-white">{sample.title}</h4>
                        <span className="text-[10px] font-mono text-cyan-400 ml-1 shrink-0">{sample.resolution}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{sample.sensor}</p>
                      <p className="text-[11px] font-mono text-slate-400 mt-1">{sample.acquisitionDate}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom File Upload Option */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.tif,.tiff"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-white/20 hover:border-cyan-400/60 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Upload GeoTIFF or Custom Raster (Max 250MB)</span>
              </button>
              {customImage && (
                <div className="mt-2 text-xs font-mono text-emerald-400 flex items-center justify-between">
                  <span>Custom image loaded</span>
                  <button
                    onClick={() => {
                      setCustomImage(null);
                      setDetections([]);
                    }}
                    className="text-slate-400 hover:text-rose-400 underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Natural Language Query Console */}
          <div className="rounded-2xl p-5 glass-panel border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-slate-300 font-semibold flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Natural-Language Query</span>
                </label>
                <span className="text-[11px] font-mono text-purple-400">VLM Engine Ready</span>
              </div>

              <textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Ask any question about this satellite scene (e.g. 'Detect all cargo vessels and extract bounding coordinates' or 'Measure parcel canopy moisture')..."
                rows={3}
                className="w-full p-3.5 rounded-xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm text-slate-100 placeholder:text-slate-400 resize-none font-sans"
              />

              {/* Recommended Quick Query Prompts */}
              <div className="mt-3">
                <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                  Suggested Context Queries:
                </span>
                <div className="space-y-1.5">
                  {selectedSample.recommendedQueries.slice(0, 3).map((query, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => setQueryText(query)}
                      className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-xs text-slate-300 transition-colors truncate cursor-pointer"
                    >
                      &ldquo;{query}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grounding Parameters */}
            <div className="mt-5 pt-4 border-t border-white/10 space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Confidence Threshold</span>
                  <span className="text-cyan-400 font-bold">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={98}
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Execute Action */}
              <button
                onClick={handleRunAnalysis}
                disabled={isProcessing || !queryText.trim()}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isProcessing
                    ? 'bg-blue-600/50 text-slate-300 cursor-not-allowed'
                    : !queryText.trim()
                    ? 'bg-white/10 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20 active:scale-[0.98]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>{processStep || 'Analyzing Orbital Swath...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Execute Satellite Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: High-Precision Satellite Viewport & Results (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          
          {/* Viewport Control Bar */}
          <div className="rounded-2xl p-4 glass-panel border border-white/10 flex flex-wrap items-center justify-between gap-3">
            {/* Spectral Band Presets */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
              <button
                onClick={() => setBandPreset('rgb')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  bandPreset === 'rgb' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Natural RGB (4-3-2)
              </button>
              <button
                onClick={() => setBandPreset('cir')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  bandPreset === 'cir' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Color Infrared (NIR)
              </button>
              <button
                onClick={() => setBandPreset('ndvi')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  bandPreset === 'ndvi' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Vegetation Index (NDVI)
              </button>
            </div>

            {/* Overlay & View Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                  showGrid ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300' : 'border-white/10 text-slate-400'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                  showLabels ? 'border-purple-400/40 bg-purple-400/10 text-purple-300' : 'border-white/10 text-slate-400'
                }`}
              >
                Labels
              </button>
              <div className="flex items-center gap-1 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.2))}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-300 px-1">{(zoomLevel * 100).toFixed(0)}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(2.5, zoomLevel + 0.2))}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Satellite Image Canvas */}
          <div
            ref={canvasContainerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden glass-panel border border-white/15 bg-slate-950 cursor-crosshair-custom select-none"
          >
            {/* Satellite Raster Image with Filters according to Band preset */}
            <div
              className="w-full h-full transition-transform duration-200 ease-out origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={activeImage}
                alt={selectedSample.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  bandPreset === 'cir'
                    ? 'filter contrast-125 hue-rotate-[290deg] saturate-150'
                    : bandPreset === 'ndvi'
                    ? 'filter contrast-150 saturate-200 hue-rotate-[90deg]'
                    : ''
                }`}
              />

              {/* Geo Grid Overlay */}
              {showGrid && (
                <div className="absolute inset-0 sat-grid-bg pointer-events-none opacity-40" />
              )}

              {/* Grounded Detection Bounding Boxes */}
              {analysisCompleted && detections.map((det) => {
                const isSelected = selectedDetection?.id === det.id;
                return (
                  <div
                    key={det.id}
                    onClick={() => setSelectedDetection(det)}
                    style={{
                      top: `${det.bbox[1]}%`,
                      left: `${det.bbox[0]}%`,
                      width: `${det.bbox[2]}%`,
                      height: `${det.bbox[3]}%`,
                    }}
                    className={`absolute border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-400/25 shadow-[0_0_20px_rgba(34,211,238,0.7)]'
                        : 'border-yellow-400/90 bg-yellow-400/10 hover:border-cyan-400'
                    }`}
                  >
                    {/* BBox Label Tag */}
                    {showLabels && (
                      <div className="absolute -top-7 left-0 px-2 py-0.5 rounded bg-slate-950/90 border border-white/20 text-[10px] font-mono text-cyan-300 whitespace-nowrap shadow-md">
                        <span className="font-bold">{det.id}:</span> {det.label} ({det.confidence}%)
                      </div>
                    )}

                    {/* Corner Target Reticles */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />
                  </div>
                );
              })}
            </div>

            {/* HUD Coordinate & Measurement Scale */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-3 pointer-events-none">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Compass className="w-4 h-4" />
                <span>CRS: {selectedSample.crs.split('/')[0]}</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5">
                <div className="w-12 h-1 bg-white border border-slate-900" />
                <span>500 m</span>
              </div>
            </div>

            {/* Analysis In-Progress Indicator Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-2 border-purple-500/20 border-b-purple-400 animate-[spin_1.5s_linear_infinite_reverse]" />
                </div>
                <h4 className="text-base font-bold text-white font-display">Processing Satellite Swath</h4>
                <p className="mt-1 text-xs font-mono text-cyan-300">{processStep}</p>
              </div>
            )}
          </div>

          {/* Results Grounding Drawer */}
          {analysisCompleted && (
            <div className="rounded-2xl p-5 glass-panel border border-white/10 bg-[#091122]">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Grounding Completed · {detections.length} Features Resolved</span>
                  </div>
                  <h4 className="text-base font-bold text-white font-display">
                    Extracted Geographic Targets & Radiometric Profiles
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportGeoJSON}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export GeoJSON</span>
                  </button>
                </div>
              </div>

              {/* Detections List Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {detections.map((det) => {
                  const isSelected = selectedDetection?.id === det.id;
                  return (
                    <div
                      key={det.id}
                      onClick={() => setSelectedDetection(det)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/15 shadow-sm'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-cyan-400 font-bold">{det.id}</span>
                        <span className="text-slate-400">{det.confidence}%</span>
                      </div>
                      <h5 className="text-sm font-semibold text-white truncate">{det.label}</h5>
                      <div className="mt-2 text-[11px] font-mono text-slate-400">
                        Geo: {det.coordinates}
                      </div>
                      {det.areaEstimate && (
                        <div className="text-[11px] font-mono text-slate-400">
                          Extent: {det.areaEstimate}
                        </div>
                      )}
                      {det.spectralSignature && (
                        <div className="mt-1.5 text-[10px] font-mono text-purple-300 truncate">
                          {det.spectralSignature}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Initial State Instructions if analysis not run yet */}
          {!analysisCompleted && !isProcessing && (
            <div className="rounded-2xl p-4 glass-panel border border-white/10 bg-white/5 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Ready for query execution. Type a natural-language prompt or select a suggested prompt above.</span>
              </div>
              <span className="font-mono text-slate-400 hidden sm:inline">Ground Sampling: {selectedSample.resolution}</span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
