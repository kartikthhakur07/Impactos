import exifr from 'exifr';

export interface ExifDataResult {
  hasGps: boolean;
  hasTimestamp: boolean;
  lat?: number;
  lng?: number;
  capturedAt?: string;
  camera?: string;
  software?: string;
  flags: string[];
}

export async function extractExifFromBuffer(buffer: Buffer): Promise<ExifDataResult> {
  const flags: string[] = [];

  try {
    const rawExif = await exifr.parse(buffer, {
      gps: true,
      reviveValues: true,
      tiff: true,
      exif: true
    });

    if (!rawExif) {
      return {
        hasGps: false,
        hasTimestamp: false,
        flags: ['metadata missing (no EXIF header found)']
      };
    }

    let lat: number | undefined;
    let lng: number | undefined;
    let hasGps = false;

    if (typeof rawExif.latitude === 'number' && typeof rawExif.longitude === 'number') {
      lat = rawExif.latitude;
      lng = rawExif.longitude;

      // Handle South (S) and West (W) negative coordinate signs
      if (rawExif.GPSLatitudeRef === 'S' || rawExif.GPSLatitudeRef === 'South') {
        if (lat !== undefined) lat = -Math.abs(lat);
      }
      if (rawExif.GPSLongitudeRef === 'W' || rawExif.GPSLongitudeRef === 'West') {
        if (lng !== undefined) lng = -Math.abs(lng);
      }

      hasGps = true;
    } else {
      flags.push('GPS location missing from EXIF');
    }

    let capturedAt: string | undefined;
    let hasTimestamp = false;
    const dateObj = rawExif.DateTimeOriginal || rawExif.CreateDate || rawExif.ModifyDate;
    if (dateObj) {
      try {
        capturedAt = new Date(dateObj).toISOString();
        hasTimestamp = true;
      } catch (e) {
        flags.push('Invalid DateTimeOriginal format in EXIF');
      }
    } else {
      flags.push('Original capture timestamp missing from EXIF');
    }

    const make = rawExif.Make ? String(rawExif.Make).trim() : '';
    const model = rawExif.Model ? String(rawExif.Model).trim() : '';
    const camera = [make, model].filter(Boolean).join(' ') || rawExif.LensModel || undefined;
    const software = rawExif.Software ? String(rawExif.Software).trim() : undefined;

    return {
      hasGps,
      hasTimestamp,
      lat,
      lng,
      capturedAt,
      camera,
      software,
      flags
    };

  } catch (error: any) {
    return {
      hasGps: false,
      hasTimestamp: false,
      flags: [`EXIF parsing error: ${error.message || 'metadata unreadable'}`]
    };
  }
}
