import dotenv from 'dotenv';
import dayjs from 'dayjs';
dotenv.config();

interface Coordinates {
  lon: number;
  lat: number;
}

class Weather {
  city:string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  date:string;
  icon: string;
  description: string;

  constructor(city:string,tempF: number, windSpeed: number, humidity: number, date:string,icon: string, description: string) {
    this.city = city;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.date = date;
    this.icon = icon;
    this.description = description;
  }
}

class WeatherService {
  private baseURL: string = process.env.API_BASE_URL || '';
  private apiKey: string = process.env.API_KEY || '';

  constructor() {
    if (!this.baseURL || !this.apiKey) {
      throw new Error('API_BASE_URL and API_KEY must be set in the environment variables');
    }
  }

  // Fetch location data by city name
  async fetchLocationData(query: string): Promise<Coordinates> {
    const url = this.buildGeocodeQuery(query);
    const response = await fetch(url);
    const jsonData = await response.json();
    if (!jsonData[0]) throw new Error('Location not found');
    return this.destructureLocationData(jsonData[0]);
  }

  // Destructure location data to extract coordinates
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData;
    if (lat === undefined || lon === undefined) {
      throw new Error('Invalid location data: latitude or longitude is undefined.');
    }
    return { lat, lon };
  }

  // Build URL for geocoding request
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
  }

  // Build URL for weather and forecast request
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  

  // Fetch weather data by coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    return await response.json();
  }

  // Parse current weather into Weather object
  private parseCurrentWeather(response: any): Weather {
    const city = response.city.name;
    console.log('city',city);
    const data = response.list[0];
    const date = dayjs.unix(data.dt).format('M/D/YYYY');
    const tempF = data.main.temp;
    const windSpeed = data.wind.speed;
    const humidity = data.main.humidity;
    const icon = data.weather[0].icon;
    const description = data.weather[0].description;
    return new Weather(city,tempF, windSpeed, humidity, date, icon, description);
  }

  // Build forecast array (filters for one entry per day)
  private buildForecastArray(currentWeather: Weather, listData: any[]): Weather[] {
    const forecastArray: Weather[] = [currentWeather];
    const uniqueDates = new Set<string>();

    for (const data of listData) {
      const date = dayjs.unix(data.dt).format('M/D/YYYY');
      if (!uniqueDates.has(date)) {
        uniqueDates.add(date);
        const tempF = data.main.temp;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;
        const icon = data.weather[0].icon;
        const description = data.weather[0].description;
        const forecastItem = new Weather(currentWeather.city,tempF, windSpeed, humidity,  date, icon, description);
        forecastArray.push(forecastItem);
      }
    }

    return forecastArray;
  }

  // Get weather for a city
  public async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      const coords = await this.fetchLocationData(city);
      const response = await this.fetchWeatherData(coords);

      // Parse current weather and forecast
      const currentWeather = this.parseCurrentWeather(response);
      const forecastArray = this.buildForecastArray(currentWeather, response.list);
      
      return forecastArray;
    } catch (error) {
      console.error(error);
      throw new Error(`Unable to fetch weather for city: ${city}`);
    }
  }
}


export default new WeatherService();