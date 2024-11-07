import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates{
  longitude: number;
  latitude: number;
}

// TODO: Define a class for the Weather object
class Weather {

  temperature: number;
  city: string;
  feelsLike: number;

  constructor (temperature:number, city:string,feelsLike:number){
    this.temperature = temperature;
    this.city = city;
    this.feelsLike = feelsLike;
    
  }
  }

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties

  
  baseURL = process.env.API_BASE_URL ||'';
  apiKey = process.env.API_KEY || '';
  apiURL =`https://api.openweathermap.org/data/2.5/forecast?appid=${this.apiKey}&units=metric`;
  cityName = `CITY_NAME`;
  
  
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const baseURLQuery = `${this.baseURL}/data/2.5/weather?q=${query}&appid=${this.apiKey}`
    try{
      const response = await fetch(baseURLQuery);
      const query = await response.json();
      return query;
      }catch (error) {
        console.error('Error fetching location data:', error);
        throw error; // Re-throw the error for handling in the calling function
      }
    }
  

  
  // TODO: Create destructureLocationData method
    private destructureLocationData(locationData: Coordinates):Coordinates{
    const  { latitude, longitude } = locationData;
    return { latitude, longitude };
    //console.log(locationData);
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(locationData:Coordinates): string {
    const {latitude, longitude} = locationData
    return `${this.baseURL}/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1000&appid=${this.apiKey}`;
    
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`
    
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(locationData: Coordinates) {
    //const geocodeQuery = this.buildGeocodeQuery();
    
    const response = this.buildGeocodeQuery(locationData);
    const data = await this.fetchLocationData(response);
        return this.destructureLocationData(data);

  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const weatherData = await response.json()
    return weatherData;
  }
  // TODO: Build parseCurrentWeather method
 private parseCurrentWeather(response: any) {
  const data=response.data;
  return {
    city: data.name,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,

  };
 }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [];
    // Assuming weatherData is an array of forecasts from the API
    for (const forecast of weatherData) {
        forecastArray.push({
        // Map forecast data to Weather properties
        city: currentWeather.city, // Assuming forecast doesn't have city data // Assuming forecast doesn't have country data
        temperature: forecast.main.temp,
        feelsLike: forecast.main.feels_like,
      });
    }

    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
      this.cityName = city;
      const cityQuery = await this.fetchLocationData(city);
      const coordinates = await this.fetchAndDestructureLocationData(cityQuery);
      const weatherData = await this.fetchWeatherData(coordinates);
      const parsedWeatherData = await this.parseCurrentWeather(weatherData);
      const weatherForecast = await this.buildForecastArray(parsedWeatherData, weatherData);


      return weatherForecast;
 
  }
  }
export default new WeatherService();
