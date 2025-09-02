export interface GeocodeResult {
  x: number;
  y: number;
}

export const GEOCODING_QUERY_KEYS = {
  geocode: (address: string) => ['geocoding', address] as const,
} as const;
