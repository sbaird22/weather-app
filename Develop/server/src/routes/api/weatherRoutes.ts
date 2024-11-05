import { Router, type Request, type Response } from 'express';
//import { readFileSync } from 'fs';
const router = Router();


import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  // TODO: GET weather data from city name

  try{
    console.log(req.body)
    const cityName = req.body.cityName;
WeatherService.getWeatherForCity(cityName).then((data)=> {
  // TODO: save city to search history
  HistoryService.addCity(cityName);
  res.json(data);
})
}catch(err){
console.log(err);
res.status(500).json(err);
}
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  HistoryService.getCities()
  .then((data)=> {
return res.json(data);
  })
  .catch((err)=> {
    res.status(500).json(err);
});
});
  

// * BONUS TODO: DELETE city from search history
//router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;