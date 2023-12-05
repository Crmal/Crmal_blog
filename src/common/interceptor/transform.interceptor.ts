import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  [key: string]: any;
}

const jsonFilter = ['link', 'metadata'];

@Injectable()
export class TransformInterceptor<T = any> implements NestInterceptor<T, Response<T>> {
  private isObject = (data: any): data is Record<string, any> =>
    typeof data === 'object' && data !== null;

  private handleResponse = (data: T): Record<string, any> => {
    const res: Record<string, any> = { data: {} };

    Object.keys(data).forEach(key => {
      if (jsonFilter.includes(key)) {
        res[key] = data[key];
      } else {
        res.data[key] = data[key];
      }
    });

    return res;
  };

  private handleObjectData = (data: T): Response<T> => {
    const res = this.handleResponse(data);
    return res as Response<T>;
  };

  private handleNonObjectData = (data: T): Response<T> => ({ data });

  private handleData = (data: T): Response<T> =>
    this.isObject(data) ? this.handleObjectData(data) : this.handleNonObjectData(data);

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(this.handleData));
  }
}
