import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
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
export class LeaderService {

  constructor(private restangular: Restangular,
              private processHTTPMsgService: ProcessHttpmsgService) { }

  getleaders(): Observable<Leader[]>
   {
	   return this.restangular.all('leaders').getList();

   } 
  getFeaturedLeader(): Observable<Leader>
  {
    return this.restangular.all('leaders').getList({featured: true})
      .map(leaders => leaders[0]);

  }
}
