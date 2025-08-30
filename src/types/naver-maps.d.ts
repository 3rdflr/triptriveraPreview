declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: MapOptions) => NaverMap;
        LatLng: new (lat: number, lng: number) => LatLng;
        Marker: new (options: MarkerOptions) => Marker;
        InfoWindow: new (options: InfoWindowOptions) => InfoWindow;
        Event: {
          addListener: (
            instance: NaverMap | Marker | InfoWindow,
            eventName: string,
            handler: (...args: unknown[]) => void,
          ) => EventListener;
          removeListener: (listener: EventListener) => void;
        };
        Service: {
          geocode: (options: GeocodeOptions, callback: GeocodeCallback) => void;
          reverseGeocode: (options: ReverseGeocodeOptions, callback: GeocodeCallback) => void;
        };
        TransCoord: {
          fromTM128ToLatLng: (tm128: Point) => LatLng;
          fromLatLngToTM128: (latlng: LatLng) => Point;
        };
        KVO: unknown;
        Bounds: new (sw: LatLng, ne: LatLng) => Bounds;
        Size: new (width: number, height: number) => Size;
        Point: new (x: number, y: number) => Point;
      };
    };
  }

  interface MapOptions {
    center?: LatLng;
    zoom?: number;
    mapTypeControl?: boolean;
    scaleControl?: boolean;
    logoControl?: boolean;
    mapDataControl?: boolean;
    zoomControl?: boolean;
    minZoom?: number;
    maxZoom?: number;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: NaverMap;
    title?: string;
    icon?: string | MarkerIcon;
    shape?: MarkerShape;
    clickable?: boolean;
    draggable?: boolean;
    visible?: boolean;
    zIndex?: number;
  }

  interface InfoWindowOptions {
    content: string;
    maxWidth?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    anchorSize?: Size;
    anchorSkew?: boolean;
    anchorColor?: string;
    pixelOffset?: Point;
  }

  interface GeocodeOptions {
    query: string;
    coordinate?: LatLng;
    filter?: string;
    page?: number;
    count?: number;
  }

  interface ReverseGeocodeOptions {
    coords: LatLng;
    orders?: string[];
  }

  interface GeocodeCallback {
    (status: string, response: GeocodeResponse): void;
  }

  interface GeocodeResponse {
    v2: {
      status: {
        code: number;
        name: string;
        message: string;
      };
      meta: {
        totalCount: number;
        page: number;
        count: number;
      };
      addresses: Array<{
        roadAddress: string;
        jibunAddress: string;
        englishAddress: string;
        x: string;
        y: string;
        distance: number;
      }>;
      errorMessage?: string;
    };
  }

  interface NaverMap {
    setCenter(center: LatLng): void;
    getCenter(): LatLng;
    setZoom(zoom: number): void;
    getZoom(): number;
    setBounds(bounds: Bounds): void;
    getBounds(): Bounds;
    fitBounds(bounds: Bounds): void;
    panTo(coord: LatLng): void;
    panBy(offset: Point): void;
    refresh(): void;
    destroy(): void;
  }

  interface LatLng {
    lat(): number;
    lng(): number;
    toString(): string;
    equals(latlng: LatLng): boolean;
    destinationPoint(angle: number, meter: number): LatLng;
    direction(latlng: LatLng): number;
    distance(latlng: LatLng): number;
  }

  interface Marker {
    setPosition(position: LatLng): void;
    getPosition(): LatLng;
    setMap(map: NaverMap | null): void;
    getMap(): NaverMap | null;
    setVisible(visible: boolean): void;
    getVisible(): boolean;
    setIcon(icon: string | MarkerIcon): void;
    getIcon(): string | MarkerIcon;
    setTitle(title: string): void;
    getTitle(): string;
    setZIndex(zIndex: number): void;
    getZIndex(): number;
  }

  interface InfoWindow {
    open(map: NaverMap, anchor?: LatLng | Marker): void;
    close(): void;
    getMap(): NaverMap | null;
    setContent(content: string): void;
    getContent(): string;
    setPosition(position: LatLng): void;
    getPosition(): LatLng;
  }

  interface EventListener {
    remove(): void;
  }

  interface MarkerIcon {
    url: string;
    size?: Size;
    scaledSize?: Size;
    origin?: Point;
    anchor?: Point;
  }

  interface MarkerShape {
    coords: number[];
    type: string;
  }

  interface Bounds {
    extend(latlng: LatLng): Bounds;
    union(bounds: Bounds): Bounds;
    intersects(bounds: Bounds): boolean;
    isEmpty(): boolean;
    equals(bounds: Bounds): boolean;
    getCenter(): LatLng;
    getSW(): LatLng;
    getNE(): LatLng;
    hasLatLng(latlng: LatLng): boolean;
  }

  interface Size {
    width: number;
    height: number;
    equals(size: Size): boolean;
  }

  interface Point {
    x: number;
    y: number;
    equals(point: Point): boolean;
    add(point: Point): Point;
    subtract(point: Point): Point;
  }
}

export {};
