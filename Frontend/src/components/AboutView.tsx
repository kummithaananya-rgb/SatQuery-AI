import React from 'react';
import { Satellite, Globe, Cpu, ShieldCheck, Compass, Radio } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="pb-8 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase mb-2">
          <span>Mission & Technology</span>
          <span className="text-slate-600">·</span>
          <span>Remote Sensing Vision-Language Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
          SatQuery AI Architecture
        </h1>
        <p className="mt-3 text-base text-slate-300 leading-relaxed max-w-3xl">
          SatQuery AI is built to bridge orbital sensor telemetry with foundational vision-language models, enabling analysts, environmental researchers, and geospatial engineers to query gigapixel Earth observation data using natural dialogue.
        </p>
      </div>

      {/* Grid of Architectural Pillars */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Multimodal Radiometric Ingestion
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Unlike consumer vision models limited to 8-bit RGB channels, SatQuery AI ingests high-dynamic range multispectral bands (Visible, Near-Infrared, Shortwave-Infrared, Thermal) and Synthetic Aperture Radar (SAR C-Band/X-Band) complex backscatter coefficients.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 text-xs font-mono text-cyan-400">
            Wavelength Range: 0.4 μm to 5.6 cm
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Sub-Pixel Spatial Grounding
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Every identified feature is grounded directly into geographical coordinate frames (WGS84, UTM, EPSG). Detected bounding boxes and polygons maintain direct real-world metric dimensions (meters, hectares, square kilometers).
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 text-xs font-mono text-purple-400">
            Georeferenced Precision: 0.3m Ground Sampling Distance
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Zero-Shot Remote Sensing Reasoning
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              By aligning orbital imagery with foundational geospatial knowledge, SatQuery AI resolves complex queries (e.g. &ldquo;Measure parcel canopy moisture&rdquo; or &ldquo;Detect illegal anchorages outside harbor limits&rdquo;) without fine-tuning bespoke models for every object class.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 text-xs font-mono text-indigo-400">
            Cross-Attention Over Spatial Coordinate Tokens
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Bi-Temporal Change Analytics
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Aligning multi-pass observation swaths across days, months, or decades to quantify surface alterations, infrastructure development, agricultural growth stages, and natural disaster impacts with high statistical confidence.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 text-xs font-mono text-emerald-400">
            Co-registration Error: &lt; 0.2 pixels
          </div>
        </div>

      </div>

    </div>
  );
};
