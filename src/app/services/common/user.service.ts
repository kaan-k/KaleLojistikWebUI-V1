import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusinessUser } from '../../models/businessuser/businessUser';
import { BusinessUserLoginDto } from '../../models/businessuser/businessUserLoginDto';
import { BusinessUserDto } from '../../models/businessuser/businessUserDto';
import { AccessToken } from '../../models/businessuser/accessToken';
import { SingleResponseModel } from '../../models/singleResponseModel';
import { UserTokenModel } from '../../models/user/userTokenModel';

@Injectable({
  providedIn: 'root'
})
export class BusinessUserService {
  private apiUrl = 'localhost:44363/api/BusinessUser';

  constructor(private http: HttpClient) {}

  register(user: BusinessUserDto): Observable<{ data: AccessToken }> {
    return this.http.post<{ data: AccessToken }>(`${this.apiUrl}/Add`, user);
  }

  login(login: BusinessUserLoginDto): Observable<SingleResponseModel<UserTokenModel>> {
    return this.http.post<SingleResponseModel<UserTokenModel>>(
      `${this.apiUrl}/Login`,  
      login,  
      { responseType: 'json' }
    );
}


  updateUser(id: string, user: BusinessUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/Update?id=${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Delete?id=${id}`);
  }

  getUserById(id: string): Observable<{ data: BusinessUser }> {
    return this.http.get<{ data: BusinessUser }>(`${this.apiUrl}/GetById?id=${id}`);
  }
}
