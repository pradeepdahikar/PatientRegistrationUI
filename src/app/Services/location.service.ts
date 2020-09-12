import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private _httpClient:HttpClient) { }

  getStates():Observable<any> {
   return this._httpClient.get("http://localhost:50672/api/Location/State");
  }

  getCities(stateId: number):Observable<any> {
   return this._httpClient.get("http://localhost:50672/api/Location/City/" + stateId);
  }

}
