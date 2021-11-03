export interface LocationModel {
  id: number;
  name: string;
  type: string;
  region: string;
  city: string;
  county: string;
  latitude: string;
  longitude: string;
  type_specific: TypeSpecific;
}

export interface TypeSpecific {
  icon: string;
  amenities: string;
  activities: string;
  fee: string;
}
