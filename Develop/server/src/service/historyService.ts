// TODO: Define a City class with name and id properties
//import express from 'express';
class City {
  cityName: string;
  // temperature: number;
  constructor(cityName: string) {
    this.cityName = cityName;
    // this.temperature = temperature;
  }
}

// TODO: Complete the HistoryService class
import fs from 'fs';
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  ;
   async read() {
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
  
   async write(cities: City[] = []):Promise<void> {
   try {
  
     const jsonData = JSON.stringify(cities);
     console.log(jsonData);
     fs.writeFile('searchHistory.json', jsonData, function (err) {
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
      const data = await this.read();
    const cities = JSON.parse(data);
    console.log('cities',cities);
    return cities;
    } catch (err) {
      console.error('Error reading cities:', err);
      return [];
   }}
  
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    try {
      const cities = await this.read();
      //const searchHistory = JSON.parse(data);
      cities.push({ cityName: city });
      await this.write(cities);
      console.log(cities);
      // Check if the city already exists
      // if (!searchHistory.includes(city)) {
      //   const updatedCities = searchHistory.push(city);
      //   await this.write(updatedCities);
      //   }
      } catch (err) {
      console.error('Error adding city:', err);
      throw err; 
    }
  
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}

    }
 const histServ =  new HistoryService();
//  const app = express();
// app.use(express.json());
histServ.write();
  histServ.read();
  histServ.getCities();
  histServ.addCity('Denver')


export default new HistoryService();