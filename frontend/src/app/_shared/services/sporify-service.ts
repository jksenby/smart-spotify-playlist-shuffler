import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SporifyService {
  constructor(private http: HttpClient) {}
  
 
}
