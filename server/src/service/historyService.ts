import fs from 'fs';
import path from 'path';

// City class definition
class City {
  city: string;
  id: string;

  constructor(city: string, id: string) {
    this.city = city;
    this.id = id;
  }
}

class HistoryService {
  private filePath: string;

  constructor() {
    // Resolve the file path using path.resolve()
    this.filePath = path.resolve('searchHistory.json');
  }

  // Ensure the file exists before reading it
  private async ensureFileExists() {
    try {
      await fs.promises.access(this.filePath);  // Check if file exists
    } catch {
      // Create an empty file if not found
      await fs.promises.writeFile(this.filePath, '[]', 'utf-8');
    }
  }

  // Read data from the file
  private async read(): Promise<City[]> {
    await this.ensureFileExists();  // Make sure the file exists
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      const jsonData = JSON.parse(data);
      return jsonData.map((cityData: { city: string; id: string }) => new City(cityData.city, cityData.id));
    } catch (err) {
      console.error('Error reading search history:', err);
      return [];
    }
  }

  // Write updated cities array to the file
  private async write(cities: City[]): Promise<void> {
    try {
      const jsonData = JSON.stringify(cities, null, 2);
      await fs.promises.writeFile(this.filePath, jsonData);
      console.log('Successfully written to searchHistory.json');
    } catch (err) {
      console.error('Error writing to searchHistory.json:', err);
    }
  }

  // Get all cities from the file
  public async getCities(): Promise<City[]> {
    try {
      return await this.read();
    } catch (err) {
      console.error('Error reading cities:', err);
      return [];
    }
  }

  // Add a new city to the history
  public async addCity(city: string): Promise<void> {
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