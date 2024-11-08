import { Router, type Request, type Response } from 'express';
const router = Router();


import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

router.post('/', (req: Request, res: Response) => {
  // GET weather data from city name
  try{
    const cityName = req.body.cityName;
    WeatherService.getWeatherForCity(cityName).then((data)=> {
  //  save city to search history
  HistoryService.addCity(cityName);
  res.json(data);
})
}catch(err){
console.log(err);
res.status(500).json(err);
}
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  HistoryService.getCities()
  .then((data)=> {
return res.json(data);
  })
  .catch((err)=> {
    res.status(500).json(err);
});
});
  
export default router;
