import { Injectable } from '@angular/core';
import { TtdHttpClientService } from '../ttdHttpClient/ttd-http-client.service';
import { SingleResponseModel } from '../../models/singleResponseModel';
import { Language } from '../../models/language/language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService extends TtdHttpClientService {

  _controller="Language"
  setLanguage(routingKey:string){
    return this.get<SingleResponseModel<Language>>({controller:this._controller,action:"SetLanguage",queryString:`language=${routingKey}`})
  }
}
