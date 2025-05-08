// import { Injectable } from '@angular/core';
// import { TtdHttpClientService } from '../ttdHttpClient/ttd-http-client.service';
// import { SingleResponseModel } from '../../models/singleResponseModel';
// import { Translate } from '../../models/translate/translate';

// @Injectable({
//   providedIn: 'root'
// })
// export class TranslateService extends TtdHttpClientService {

//   private _controller="Langu"
 
//   translate(sourceText:string,languFrom:string,languTo:string) {
//     const observable = this.get<SingleResponseModel<Translate>>({ controller: this._controller, action: "Translate", queryString:`sourceText=${sourceText}&languFrom=${languFrom}&languTo=${languTo}` })
//     return observable
//   }


// }