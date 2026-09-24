import { SatelliteSample, AnalysisRecord } from '../types';
import opticalImg from '../assets/images/multimodal_satellite_optical_1790235611853.jpg';
import sarImg from '../assets/images/sar_radar_coastal_1790235625239.jpg';
import changeImg from '../assets/images/satellite_change_detection_1790235637290.jpg';

export const SATELLITE_SAMPLES: SatelliteSample[] = [
  {
    id: 'opt-agri-01',
    title: 'Agricultural Basin & River Delta',
    sensor: 'Sentinel-2 MSI Level-2A',
    modality: 'Multispectral',
    resolution: '10m GSD',
    acquisitionDate: '2026-08-14 10:42 UTC',
    coordinates: '43°34\'12"N, 4°42\'29"E',
    crs: 'WGS84 / UTM zone 31N',
    imageUrl: opticalImg,
    description: 'High-resolution multispectral reflectance capture of parcel crop distribution, irrigation canals, and alluvial wetlands.',
    recommendedQueries: [
      'Segment all irrigated agricultural parcels and evaluate crop moisture status',
      'Detect center-pivot irrigation circles and measure radius distribution',
      'Identify sediment plumes discharging along the river delta boundary',
      'Locate solar photovoltaic farm installations adjacent to the canal'
    ]
  },
  {
    id: 'sar-harbor-02',
    title: 'Commercial Harbor & Anchorage',
    sensor: 'Sentinel-1 C-SAR IW Mode',
    modality: 'SAR',
    resolution: '5m × 20m Spatial Res',
    acquisitionDate: '2026-09-02 05:18 UTC',
    coordinates: '51°55\'18"N, 4°17\'52"E',
    crs: 'WGS84 / EPSG:4326',
    imageUrl: sarImg,
    description: 'Synthetic aperture radar backscatter imaging penetrating cloud cover, highlighting metallic vessels, berths, and sea surface roughness.',
    recommendedQueries: [
      'Detect all moored container vessels and extract hull bounding coordinates',
      'Identify oil slick surface damping signatures in the outer fairway channel',
      'Measure harbor breakwater structural boundaries under high radar backscatter',
      'Count anchored cargo tankers in the offshore waiting zone'
    ]
  },
  {
    id: 'chg-reservoir-03',
    title: 'Reservoir Waterline & Forest Margin',
    sensor: 'Landsat-9 OLI-2 / TIRS-2',
    modality: 'Change Detection',
    resolution: '15m Panchromatic / 30m Multispectral',
    acquisitionDate: '2026-07-29 18:05 UTC',
    coordinates: '36°01\'04"N, 114°44\'17"W',
    crs: 'NAD83 / UTM zone 11N',
    imageUrl: changeImg,
    description: 'Bi-temporal orbital observation calibrated for surface water shoreline retreat and surrounding pinon-juniper forest canopy density.',
    recommendedQueries: [
      'Quantify waterline boundary recession compared to baseline summer 2024',
      'Map post-wildfire burn scar perimeter and vegetative recovery rate',
      'Identify exposed reservoir sediment islands above the current bathymetric pool',
      'Detect road network expansion into forested watershed boundaries'
    ]
  }
];

export const RECENT_MISSION_HISTORY: AnalysisRecord[] = [
  {
    id: 'SAT-9042',
    timestamp: '2026-09-23 16:20:14 UTC',
    satellite: 'Sentinel-2 MSI',
    modality: 'Multispectral',
    query: 'Identify center-pivot irrigation circles and measure parcel density across quadrant B-4',
    coordinates: '38°12\'N, 102°45\'W',
    status: 'Completed',
    detectionsCount: 42
  },
  {
    id: 'SAT-9041',
    timestamp: '2026-09-22 08:14:02 UTC',
    satellite: 'Sentinel-1 C-SAR',
    modality: 'SAR Radar',
    query: 'Detect cargo vessels exceeding 150m LOA in the Malacca Strait traffic separation zone',
    coordinates: '02°44\'N, 101°29\'E',
    status: 'Completed',
    detectionsCount: 19
  },
  {
    id: 'SAT-9040',
    timestamp: '2026-09-20 22:50:33 UTC',
    satellite: 'Landsat-9 OLI-2',
    modality: 'Change Detection',
    query: 'Calculate surface water area shrinkage of Lake Urmia relative to 2025 epoch',
    coordinates: '37°42\'N, 45°19\'E',
    status: 'Completed',
    detectionsCount: 7
  },
  {
    id: 'SAT-9039',
    timestamp: '2026-09-18 11:32:10 UTC',
    satellite: 'PlanetScope SuperDove',
    modality: 'Optical',
    query: 'Locate illegal mining dredge pits along the Madre de Dios river corridor',
    coordinates: '12°35\'S, 69°11\'W',
    status: 'Completed',
    detectionsCount: 31
  },
  {
    id: 'SAT-9038',
    timestamp: '2026-09-16 03:08:44 UTC',
    satellite: 'COSMO-SkyMed 2',
    modality: 'SAR Radar',
    query: 'Identify structural displacement along the fault line escarpment post-seismic event',
    coordinates: '37°21\'N, 15°04\'E',
    status: 'Completed',
    detectionsCount: 12
  }
];
