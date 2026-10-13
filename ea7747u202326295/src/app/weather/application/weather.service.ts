import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { WeatherInfoEntity } from '../domain/entities/weather-info.entity';

interface OpenMeteoResponse { current?: { temperature_2m?: number }; }

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}
  getCurrentTemperature(latitude: number, longitude: number): Observable<WeatherInfoEntity> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;
    return this.http.get<OpenMeteoResponse>(url).pipe(map(response => {
      const temperature = response.current?.temperature_2m;
      if (typeof temperature !== 'number') throw new Error('Weather response did not include a temperature.');
      return { temperature };
    }));
  }
}
