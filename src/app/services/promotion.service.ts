import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/delay';
import { Http, Response } from '@angular/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class PromotionService {

  constructor(private restangular: Restangular,
              private processHTTPMsgService: ProcessHttpmsgService) { }

  getPromotions(): Observable<Promotion[]> {
   return this.restangular.all('promotions').getList();
  }

  getPromotion(id: number): Observable<Promotion> {
      return  this.restangular.one('promotions',id).get();

  }

  getFeaturedPromotion(): Observable<Promotion> {
     return this.restangular.all('promotions').getList({featured: true})
      .map(promotions => promotions[0]);
  }
}