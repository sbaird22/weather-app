class City {
  cityName: string;
  id: string;
  constructor(cityName: string,id:string) {
    this.cityName = cityName;
    this.id = id;
  }
}

import fs from 'fs';
class HistoryService {
  ;
  private async read() {
    try {

      const data = await fs.promises.readFile('searchHistory.json', 'utf-8');
      const jsonData = JSON.parse(data);
      console.log('parsed data',jsonData);
      return jsonData;   
    } catch (err) {
      console.error('Error reading search history:', err);
      return [];
    } 
  }
  
  //write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]):Promise<void> {
  try {
  
    const jsonData = JSON.stringify(cities,null,2);
    await fs.writeFile('searchHistory.json', jsonData, function (err) {
      if (err) {
        throw err;
      }}
  )} catch (err) {
    console.log('Error writing to searchHistory.json', err);
  }
  }
  async getCities() {
  
    try {
      const citiesData = await this.read();
    return citiesData.map((cityData:{cityName:string; id:string}) => new City(cityData.cityName,cityData.id));
    } catch (err) {
      console.error('Error reading cities:', err);
      return [];
    }
  }
  
  async addCity(city: string) {
    try {
      const cities = await this.getCities();
      const newCity = new City(city, Date.now().toString());
      cities.push(newCity);
      await this.write(cities);
    
      } catch (err) {
      console.error('Error adding city:', err);
      throw err; 
    }
  
  }
}
export default new HistoryService();