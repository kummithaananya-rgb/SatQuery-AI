import { HistoryItem, FinalAnalysisResult } from '../types';
import opticalImg from '../assets/images/multimodal_satellite_optical_1790235611853.jpg';
import { API_BASE_URL } from './api';

const STORAGE_KEY = 'satquery_analysis_history';
const INITIALIZED_FLAG_KEY = 'satquery_history_initialized';

/**
 * Default sample item conforming to the prompt specification:
 * Filename: "sentinel_scene_01.tif"
 * Query: "Identify water bodies"
 * Type: "Visual Analysis"
 * Status: "Completed"
 */
function createInitialSampleItem(): HistoryItem {
  const sampleResult: FinalAnalysisResult = {
    query: 'Identify water bodies',
    analysisType: 'Visual Analysis' as any,
    image: {
      file: new File([], 'sentinel_scene_01.tif', { type: 'image/tiff' }),
      previewUrl: opticalImg,
      filename: 'sentinel_scene_01.tif',
      width: 1024,
      height: 1024,
      sizeBytes: 2048576,
      formattedSize: '2.05 MB',
    },
    answer: 'Water body boundaries extracted with high NDWI contrast. Detected 3 primary surface water retention basins totaling 0.45 km².',
    summary: 'Contiguous water bodies identified with 94% confidence. Zero sediment obstruction observed in main reservoir.',
    confidence: 94,
    detectedObjectsText: '3 Water Bodies',
    areaText: '0.45 km²',
    locationText: '12.9716° N, 77.5946° E',
    latitude: 12.9716,
    longitude: 77.5946,
    area_km2: 0.45,
    crs: 'EPSG:4326',
    detections: [
      {
        id: 'det-water-01',
        label: 'Primary Water Reservoir',
        confidence: 96,
        bbox: [24, 28, 28, 26],
        coordinates: '12.9716° N, 77.5946° E',
        latitude: 12.9716,
        longitude: 77.5946,
        area: '0.28 km²',
        area_km2: 0.28,
        geo_polygon: [
          [12.9728, 77.5938],
          [12.9734, 77.5955],
          [12.9720, 77.5964],
          [12.9706, 77.5950],
          [12.9714, 77.5935],
        ],
        spectral_signature: 'High NDWI absorption, Low SWIR reflectance',
      },
      {
        id: 'det-water-02',
        label: 'Secondary Drainage Canal',
        confidence: 91,
        bbox: [58, 48, 24, 22],
        coordinates: '12.9680° N, 77.5980° E',
        latitude: 12.9680,
        longitude: 77.5980,
        area: '0.13 km²',
        area_km2: 0.13,
        geo_polygon: [
          [12.9692, 77.5968],
          [12.9692, 77.5992],
          [12.9668, 77.5992],
          [12.9668, 77.5968],
        ],
        spectral_signature: 'Contiguous boundary threshold 91.2%',
      },
    ],
    metadata: {
      model: 'SatQuery-Vision-v2.5',
      inputType: 'Sentinel-2 GeoTIFF',
      resolution: '10m GSD',
      crs: 'EPSG:4326',
      coordinates: '12.9716° N, 77.5946° E',
      processingTimeMs: 1280,
      analysisMethod: 'Multispectral Water Extraction',
      timestamp: '2026-09-24 07:15 UTC',
    },
  };

  return {
    id: 'hist-sentinel-01',
    filename: 'sentinel_scene_01.tif',
    thumbnailUrl: opticalImg,
    query: 'Identify water bodies',
    analysisType: 'Visual Analysis',
    date: 'Sep 24, 2026, 07:15 UTC',
    status: 'Completed',
    result: sampleResult,
  };
}

/**
 * Fetch analysis history.
 * Attempts to load from backend API if available, falling back to local storage.
 * If local storage has never been initialized, seeds one initial test item so the card UI can be viewed immediately.
 * If all items are deleted, it stays empty.
 */
export async function getAnalysisHistory(): Promise<HistoryItem[]> {
  // 1. Check if backend API has an active history endpoint
  try {
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch {
    // Backend endpoint not active; continue with local storage
  }

  // 2. Load from localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const hasInitialized = localStorage.getItem(INITIALIZED_FLAG_KEY);

    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    // First time user loads app without any saved history
    if (!hasInitialized) {
      const initialItem = createInitialSampleItem();
      const initialList = [initialItem];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialList));
      localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
      return initialList;
    }

    return [];
  } catch (err) {
    console.warn('[SatQuery History] Local storage access error:', err);
    return [];
  }
}

/**
 * Save completed analysis into history
 */
export async function saveAnalysisToHistory(result: FinalAnalysisResult): Promise<HistoryItem> {
  const now = new Date();
  const dateFormatted = `${now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC`;

  const newItem: HistoryItem = {
    id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    filename: result.image?.filename || 'satellite_scene.tif',
    thumbnailUrl: result.overlayUrl || result.image?.previewUrl || opticalImg,
    query: result.query || 'Unspecified Query',
    analysisType: result.analysisType || 'Visual Analysis',
    date: dateFormatted,
    status: 'Completed',
    result: {
      ...result,
      // Ensure the image object is serializable by cloning metadata
      image: {
        ...result.image,
        file: undefined as any, // File objects cannot be serialized to JSON
      },
    },
  };

  // Attempt to persist to backend
  try {
    fetch(`${API_BASE_URL}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    }).catch(() => {});
  } catch {}

  // Persist to localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const list: HistoryItem[] = stored ? JSON.parse(stored) : [];
    // Prepend newest first
    const updated = [newItem, ...list.filter((item) => item.id !== newItem.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
  } catch (err) {
    console.warn('[SatQuery History] Failed to write to localStorage:', err);
  }

  return newItem;
}

/**
 * Delete single analysis record from history
 */
export async function deleteAnalysisFromHistory(id: string): Promise<HistoryItem[]> {
  // Attempt to delete on backend
  try {
    fetch(`${API_BASE_URL}/history/${id}`, {
      method: 'DELETE',
    }).catch(() => {});
  } catch {}

  // Update localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const list: HistoryItem[] = stored ? JSON.parse(stored) : [];
    const updated = list.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
    return updated;
  } catch (err) {
    console.warn('[SatQuery History] Failed to delete from localStorage:', err);
    return [];
  }
}

/**
 * Clear all history records (shows empty state)
 */
export function clearAllAnalysisHistory(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
  } catch (err) {
    console.warn('[SatQuery History] Failed to clear history:', err);
  }
}
