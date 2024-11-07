// TODO: Define a City class with name and id properties
//import express from 'express';
class City {
  cityName: string;
  id: string;
  constructor(cityName: string,id:string) {
    this.cityName = cityName;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
import fs from 'fs';
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
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

     
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
   async getCities() {
  
    try {
      const citiesData = await this.read();
    return citiesData.map((cityData:{cityName:string; id:string}) => new City(cityData.cityName,cityData.id));
    } catch (err) {
      console.error('Error reading cities:', err);
      return [];
   }}
  
  // TODO Define an addCity method that adds a city to the searchHistory.json file
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
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}

    }
 const histServ =  new HistoryService();
// //  const app = express();
// // app.use(express.json());
// // histServ.write();
// //   histServ.read();
 histServ.getCities();
//   histServ.addCity('Denver')


export default new HistoryService();