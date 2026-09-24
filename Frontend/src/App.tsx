import React, { useState, useEffect } from 'react';
import { NavTab, AnalysisType, UploadedImageData } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeatureCards } from './components/FeatureCards';
import { WorkflowSection } from './components/WorkflowSection';
import { AnalysisWorkspace } from './components/AnalysisWorkspace';
import { AnalysisLoadingView } from './components/AnalysisLoadingView';
import { ResultsView } from './components/ResultsView';
import { GeospatialView } from './components/GeospatialView';
import { HistoryView } from './components/HistoryView';
import { AboutView } from './components/AboutView';
import { SettingsView } from './components/SettingsView';
import { Footer } from './components/Footer';
import { DemoModal } from './components/DemoModal';
import { FinalAnalysisResult } from './types';
import opticalSampleImg from './assets/images/multimodal_satellite_optical_1790235611853.jpg';
import { saveAnalysisToHistory } from './services/historyStorage';

export default function App() {
  // Parse initial route from URL
  const getInitialTab = (): NavTab => {
    const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
    if (path === 'results') return 'results';
    if (path === 'geospatial') return 'geospatial';
    if (path === 'analysis/loading') return 'analysis/loading';
    if (path === 'analyze') return 'analyze';
    if (path === 'history') return 'history';
    if (path === 'about') return 'about';
    if (path === 'settings') return 'settings';
    return 'home';
  };

  const getInitialResult = (): FinalAnalysisResult | null => {
    return {
      query: 'Identify water bodies and estimate their area.',
      analysisType: 'Auto Detect',
      image: {
        file: new File([], 'Sentinel-2_Agri_Delta.jpg', { type: 'image/jpeg' }),
        previewUrl: opticalSampleImg,
        filename: 'Sentinel-2_Agri_Delta.jpg',
        width: 2048,
        height: 1536,
        sizeBytes: 1845200,
        formattedSize: '1.76 MB',
      },
      answer: 'Detected water bodies in the image.',
      summary: 'Deep vision-language analysis detected 3 primary contiguous hydrological formations within the agricultural river delta basin. Water surface reflectance profile was confirmed with Normalized Difference Water Index (NDWI > 0.42) across high-resolution multispectral bands.',
      confidence: 92,
      detectedObjectsText: 'Water Bodies: 3',
      areaText: '~0.45 km²',
      locationText: '12.9716° N, 77.5946° E',
      detections: [
        {
          id: 'WB-01',
          label: 'Water body detected',
          type: 'mask',
          confidence: 94,
          bbox: [24, 28, 28, 26],
          coordinates: '12.9716° N, 77.5946° E',
          area: '0.28 km²',
          mask_polygon: [
            [26, 30], [38, 28], [51, 35], [48, 52], [32, 54], [25, 42]
          ],
          spectral_signature: 'High absorption in SWIR Band 11/12, NDWI +0.48',
        },
        {
          id: 'WB-02',
          label: 'Secondary Canal Reservoir',
          type: 'bbox',
          confidence: 91,
          bbox: [58, 48, 24, 22],
          coordinates: '12.9680° N, 77.5980° E',
          area: '0.13 km²',
          spectral_signature: 'Boundary threshold convergence 91.8%',
        },
        {
          id: 'WB-03',
          label: 'Hydrological Basin Inflow',
          type: 'point',
          confidence: 89,
          bbox: [42, 65, 8, 8],
          coordinates: '12.9730° N, 77.5910° E',
          area: '0.04 km²',
          spectral_signature: 'Centroid Reference Coordinate',
        },
      ],
      metadata: {
        model: 'SatQuery-VLM-SpaceTech v2.4',
        inputType: 'Multispectral Satellite GeoTIFF (Sentinel-2 MSI)',
        resolution: '10m Ground Sampling Distance (GSD)',
        crs: 'EPSG:4326 (WGS84) / UTM Zone 43N',
        coordinates: '12.9716° N, 77.5946° E',
        processingTimeMs: 1420,
        analysisMethod: 'Cross-Attention Multimodal Vision-Language Reasoning',
        timestamp: new Date().toISOString(),
      },
    };
  };

  const [currentTab, setCurrentTab] = useState<NavTab>(getInitialTab);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Analysis Workspace shared state for backend dispatch
  const [uploadedImage, setUploadedImage] = useState<UploadedImageData | null>(null);
  const [query, setQuery] = useState<string>('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('Auto Detect');
  const [latestResult, setLatestResult] = useState<FinalAnalysisResult | null>(getInitialResult);

  // Sync route changes with browser history
  const navigateTo = (tab: NavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const targetPath = tab === 'home' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab }, '', targetPath);
    }
  };

  // Listen to popstate (browser back / forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle clicking feature card
  const handleSelectFeature = (_modality: 'Multispectral' | 'SAR' | 'Change Detection' | 'Optical') => {
    navigateTo('analyze');
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Universal Top Navigation */}
      <Header
        currentTab={currentTab}
        onNavigate={navigateTo}
      />

      {/* Main Viewport Content based on Route */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onStartAnalysis={() => navigateTo('analyze')}
              onOpenDemo={() => setIsDemoOpen(true)}
            />

            {/* Feature Cards Section */}
            <FeatureCards
              onSelectFeature={handleSelectFeature}
            />

            {/* Bottom Workflow Section */}
            <WorkflowSection
              onStartAnalysis={() => navigateTo('analyze')}
            />
          </>
        )}

        {currentTab === 'analyze' && (
          <AnalysisWorkspace
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            query={query}
            setQuery={setQuery}
            analysisType={analysisType}
            setAnalysisType={setAnalysisType}
            onStartAnalysis={() => navigateTo('analysis/loading')}
          />
        )}

        {currentTab === 'analysis/loading' && (
          <AnalysisLoadingView
            uploadedImage={uploadedImage}
            query={query}
            analysisType={analysisType}
            onCancel={() => navigateTo('analyze')}
            onComplete={(result) => {
              setLatestResult(result);
              saveAnalysisToHistory(result);
              navigateTo('results');
            }}
          />
        )}

        {currentTab === 'results' && (
          <ResultsView
            result={latestResult}
            onNewAnalysis={() => navigateTo('analyze')}
            onOpenGeospatial={() => navigateTo('geospatial')}
          />
        )}

        {currentTab === 'geospatial' && (
          <GeospatialView
            result={latestResult}
            onBackToResults={() => navigateTo('results')}
            onNewAnalysis={() => navigateTo('analyze')}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            onViewResult={(result) => {
              setLatestResult(result);
              navigateTo('results');
            }}
            onStartAnalysis={() => navigateTo('analyze')}
          />
        )}

        {currentTab === 'about' && (
          <AboutView />
        )}

        {currentTab === 'settings' && (
          <SettingsView />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Interactive Demonstration Modal */}
      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigateAnalyze={() => navigateTo('analyze')}
      />
    </div>
  );
}

