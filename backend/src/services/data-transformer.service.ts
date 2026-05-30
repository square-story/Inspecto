import { injectable } from 'inversify';

export interface LocationInput {
    longitude: string;
    latitude: string;
}

export interface GeoJSONPoint {
    type: 'Point';
    coordinates: [number, number];
}

/**
 * Service for transforming data between different formats
 * Keeps transformation logic out of controllers
 */
@injectable()
export class DataTransformerService {
    /**
     * Transform longitude/latitude to GeoJSON Point format
     */
    transformToGeoJSON(input: LocationInput): GeoJSONPoint {
        return {
            type: 'Point',
            coordinates: [parseFloat(input.longitude), parseFloat(input.latitude)]
        };
    }

    /**
     * Merge location data with other form data
     */
    mergeProfileData(data: any, longitude: string, latitude: string): any {
        const { longitude: _, latitude: __, ...restData } = data;
        const location = this.transformToGeoJSON({ longitude, latitude });
        return { ...restData, location };
    }
}
