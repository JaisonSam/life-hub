import { NextResponse } from "next/server";

function getWeatherCondition(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Light Drizzle";
  if (code >= 61 && code <= 65) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 80 && code <= 82) return "Passing Showers";
  if (code >= 95) return "Thunderstorm";
  return "Partly Cloudy";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawLat = searchParams.get("lat");
    const rawLon = searchParams.get("lon");

    // Default to Bengaluru if coordinates are missing
    const lat = rawLat ? parseFloat(rawLat) : 12.9716;
    const lon = rawLon ? parseFloat(rawLon) : 77.5946;
    const isGps = Boolean(rawLat && rawLon);

    // 1. Fetch live weather from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&timezone=auto`;
    
    // 2. Fetch reverse geocode locality from BigDataCloud
    const geocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

    const [weatherRes, geocodeRes] = await Promise.all([
      fetch(weatherUrl, { next: { revalidate: 300 } }).catch(() => null),
      fetch(geocodeUrl, { next: { revalidate: 86400 } }).catch(() => null),
    ]);

    let weatherData: any = null;
    let geocodeData: any = null;

    if (weatherRes && weatherRes.ok) {
      weatherData = await weatherRes.json();
    }
    if (geocodeRes && geocodeRes.ok) {
      geocodeData = await geocodeRes.json();
    }

    // Extract location names
    let locationName = "Bengaluru";
    let locality = "Electronic City";

    if (geocodeData) {
      const city = geocodeData.city || geocodeData.locality || geocodeData.principalSubdivision || "";
      const loc = geocodeData.locality || geocodeData.principalSubdivision || "";
      if (city) locationName = city;
      if (loc && loc !== city) {
        locality = loc;
      } else if (geocodeData.principalSubdivision && geocodeData.principalSubdivision !== city) {
        locality = geocodeData.principalSubdivision;
      } else {
        locality = geocodeData.countryName || "Device GPS";
      }
    }

    // Current weather metrics
    const current = weatherData?.current || {};
    const temp = Math.round(current.temperature_2m ?? 24);
    const feelsLike = Math.round(current.apparent_temperature ?? temp);
    const humidity = Math.round(current.relative_humidity_2m ?? 58);
    const windSpeed = `${Math.round(current.wind_speed_10m ?? 11)} km/h`;
    const condition = getWeatherCondition(current.weather_code ?? 2);
    const isDay = current.is_day !== 0;

    // Build 5 representative hourly slots (6am, 10am, 2pm, 6pm, 10pm)
    // or next 5 hours
    const hourlyTimes = ["6am", "10am", "2pm", "6pm", "10pm"];
    const targetHours = [6, 10, 14, 18, 22];
    const hourlyTemps = weatherData?.hourly?.temperature_2m || [21, 24, 27, 25, 22];

    const hourlyForecast = targetHours.map((h, idx) => {
      const tempVal = hourlyTemps[h] !== undefined ? Math.round(hourlyTemps[h]) : temp + (idx === 2 ? 3 : -2);
      return {
        time: hourlyTimes[idx],
        temp: tempVal,
        isPeak: idx === 2, // 2pm typically peak
      };
    });

    // Find the max temperature for bar scaling
    const maxTemp = Math.max(...hourlyForecast.map((f) => f.temp), temp + 1);

    return NextResponse.json({
      success: true,
      source: isGps ? "gps" : "default",
      latitude: lat,
      longitude: lon,
      locationName,
      locality,
      temp,
      feelsLike,
      condition,
      humidity,
      windSpeed,
      isDay,
      hourly: hourlyForecast,
      maxTemp,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to fetch weather",
        locationName: "Bengaluru",
        locality: "Electronic City",
        temp: 24,
        feelsLike: 24,
        condition: "Partly Cloudy",
        humidity: 58,
        windSpeed: "11 km/h",
      },
      { status: 500 }
    );
  }
}
