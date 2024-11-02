class City {
  name: string;
  id: number;
  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
import fs from 'fs';
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
    private async read() {
      try {
        const data = await fs.promises.readFile('searchHistory.json', 'utf-8');
        const jsonData = JSON.parse(data);
        return jsonData;
      } catch (err) {
        console.error('Error reading search history:', err);
          return [];
        } 
      }
    
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
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
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    try {
      const data = await this.read();
    const cities: City[] = JSON.parse(data);
    return cities;
    } catch (err) {
      console.error('Error reading cities:', err);
      return [];
    }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    try {
      const data = await this.read();
      const searchHistory = JSON.parse(data);
  
      // Check if the city already exists
      if (!searchHistory.includes(city)) {
        const updatedCities = searchHistory.push(city);
        await this.write(updatedCities);
        }
      } catch (err) {
      console.error('Error adding city:', err);
      throw err; 
    }
  
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}

}
export default new HistoryService();