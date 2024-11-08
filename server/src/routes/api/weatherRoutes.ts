import { Router, Request, Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

router.post('/', async (req: Request, res: Response) => {
  try {
    const city = req.body.cityName;
    
    
    if (!city) {
      return res.status(400).json({ message: "City name is required" });
    }

    // Fetch weather data for the city
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Save city to search history
    await HistoryService.addCity(city);

    // Respond with the weather data
    return res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ message: 'Failed to fetch weather data', error });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const historyData = await HistoryService.getCities();
    return res.json(historyData);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    return res.status(500).json({ message: 'Failed to retrieve search history', error });
  }
});

export default router;
