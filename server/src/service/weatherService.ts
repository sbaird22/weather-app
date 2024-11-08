import dotenv from 'dotenv';
dotenv.config();

interface Coordinates{
  longitude: number;
  latitude: number;
}

class Weather {

  temperature: number;
  description: number;
  humidity: number;

  constructor (temperature:number, description:number, humidity:number){
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
    
  }
  }

class WeatherService {
  private baseURL:string = process.env.API_BASE_URL ||'';
  private apiKey:string = process.env.API_KEY || '';

  //fetchLocationData method
   async fetchLocationData(query: string) {
    console.log("fetch",query);
    const url=this.buildGeocodeQuery(query);
    const response = await fetch(url);
    const jsonData  = await response.json();
    return this.destructureLocationData(jsonData[0]);
    }
  

  
  // destructureLocationData method
    private destructureLocationData(locationData: Coordinates):Coordinates{
    
    return {latitude: locationData.latitude,
          longitude: locationData.longitude
  }}
  // buildGeocodeQuery method
    private buildGeocodeQuery (city:string):string {
      console.log(`${this.apiKey}`)
      return `${this.baseURL}/data/2.5/weather?q=${city}&appid=${this.apiKey}`;
    
  }
  // buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/current.json?=${this.apiKey}&q=${coordinates.latitude},${coordinates.longitude}`
    
  }
  // fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city:string) {
    const response = await this.fetchLocationData(city)
        return response;

  }

  // fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const weatherData = await response.json()
    return this.parseCurrentWeather(weatherData);
  }
  //Build parseCurrentWeather method
 private parseCurrentWeather(response: any):Weather {
  return new Weather(
    response.current.temp_c,
    response.current.condition.text,
    response.current.humidity
  );
}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
  //   return weatherData.map(day=> ({
  //     date:day.date,
  //     maxTemperature:day.day.maxtemp_c,
  //     minTemperature:day.day.mintemp_c,
  //     condition:day.day.condition.text
  //   }))
  //   }
  
  async getWeatherForCity(city: string) {

    const coords = await this.fetchAndDestructureLocationData(city);
    const weather = await this.fetchWeatherData(coords);
    return weather
    }
  }

  const weatherService = new WeatherService()
  weatherService.fetchLocationData('Thornton');
export default new WeatherService();
