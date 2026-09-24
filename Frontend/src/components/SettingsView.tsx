import React, { useState } from 'react';
import { Save, Check, Key, Sliders, Globe, Shield, RefreshCw } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [crs, setCrs] = useState('EPSG:4326');
  const [measurementUnit, setMeasurementUnit] = useState('metric');
  const [defaultSensor, setDefaultSensor] = useState('Sentinel-2');
  const [autoEnhanceRadiometry, setAutoEnhanceRadiometry] = useState(true);
  const [cacheTiles, setCacheTiles] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="pb-8 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase mb-2">
            <span>Workspace Configuration</span>
            <span className="text-slate-600">·</span>
            <span>Geospatial Standards</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-display">
            System & Sensor Settings
          </h1>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-purple-500 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer self-start sm:self-auto"
        >
          {savedNotice ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedNotice ? 'Settings Saved' : 'Save Preferences'}</span>
        </button>
      </div>

      {/* Form sections */}
      <div className="mt-8 space-y-6">
        
        {/* Spatial Coordinate System */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Coordinate Reference System (CRS)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Specify the default projection used for grounded spatial bounding vectors and GeoJSON export payloads.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'EPSG:4326', name: 'WGS 84 (EPSG:4326)', desc: 'Standard geographic lat/lon degrees' },
              { id: 'EPSG:3857', name: 'Web Mercator (EPSG:3857)', desc: 'Spherical mercator for web maps' },
              { id: 'UTM:AUTO', name: 'Auto UTM Zone (Universal)', desc: 'Meter-based conformal transverse projection' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCrs(item.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  crs === item.id
                    ? 'border-cyan-400 bg-cyan-500/10 text-white shadow-sm'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="text-sm font-semibold text-white">{item.name}</div>
                <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sensor & Pipeline Defaults */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Pipeline Defaults & Calibration</span>
          </h3>

          <div className="space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
              <div>
                <span className="text-sm font-medium text-white">Default Constellation Feed</span>
                <p className="text-xs text-slate-400">Preferred provider when loading unassigned geographic coordinates</p>
              </div>
              <select
                value={defaultSensor}
                onChange={(e) => setDefaultSensor(e.target.value)}
                className="bg-black/50 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="Sentinel-2">Sentinel-2 MSI (ESA Copernicus)</option>
                <option value="Landsat-9">Landsat-9 OLI-2 (USGS/NASA)</option>
                <option value="Sentinel-1">Sentinel-1 C-SAR (Radar)</option>
                <option value="PlanetScope">PlanetScope 3m Constellation</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
              <div>
                <span className="text-sm font-medium text-white">Measurement Units</span>
                <p className="text-xs text-slate-400">Area and distance unit readout formatting</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setMeasurementUnit('metric')}
                  className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    measurementUnit === 'metric' ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' : 'border-white/10 text-slate-400'
                  }`}
                >
                  Metric (m, km², ha)
                </button>
                <button
                  onClick={() => setMeasurementUnit('imperial')}
                  className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    measurementUnit === 'imperial' ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' : 'border-white/10 text-slate-400'
                  }`}
                >
                  Imperial (ft, mi², acres)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-sm font-medium text-white">Automatic Radiometric Histogram Stretch</span>
                <p className="text-xs text-slate-400">Dynamic range contrast adjustment for raw 12-bit/16-bit raster files</p>
              </div>
              <input
                type="checkbox"
                checked={autoEnhanceRadiometry}
                onChange={(e) => setAutoEnhanceRadiometry(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
