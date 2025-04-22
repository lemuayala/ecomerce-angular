import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Product } from '../../../models/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/products`;
  private cache: {
    [key: string]: {
      data: Product[];
      timestamp: number;
      observable?: Observable<Product[]>;
    };
  } = {};
  private readonly CACHE_TTL = 300_000; // 5 minutos

  constructor(private http: HttpClient) {}

  // Obtener productos con cache
  getProducts(refresh = false): Observable<Product[]> {
    const cacheKey = 'products_all';

    if (refresh || !this.cache[cacheKey]) {
      return this.fetchProducts(cacheKey);
    }

    if (this.isCacheExpired(cacheKey)) {
      return of(this.cache[cacheKey].data).pipe(
        switchMap(() => this.fetchProducts(cacheKey, false))
      );
    }

    return of(this.cache[cacheKey].data);
  }

  // Crear nuevo producto
  createProduct(productData: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, productData).pipe(
      tap((newProduct) => {
        this.updateCacheWithNewProduct(newProduct);
      }),
      catchError((error) => {
        this.invalidateCache();
        return throwError(() => error);
      })
    );
  }

  // Actualizar producto
  updateProduct(
    id: number,
    productData: Partial<Product>
  ): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productData).pipe(
      tap((updatedProduct) => {
        this.updateCacheWithUpdatedProduct(updatedProduct);
      }),
      catchError((error) => {
        this.invalidateCache();
        return throwError(() => error);
      })
    );
  }

  // Eliminar producto
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.updateCacheAfterDelete(id);
      }),
      catchError((error) => {
        this.invalidateCache();
        return throwError(() => error);
      })
    );
  }

  /**
   * Métodos privados para manejo de cache
   */

  private fetchProducts(
    cacheKey: string,
    updateCache = true
  ): Observable<Product[]> {
    if (this.cache[cacheKey]?.observable) {
      return this.cache[cacheKey].observable!;
    }

    const request$ = this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => {
        if (updateCache) {
          this.updateCache(cacheKey, products);
        }
      }),
      catchError((error) => {
        delete this.cache[cacheKey]?.observable;
        return throwError(() => error);
      }),
      shareReplay(1)
    );

    if (!this.cache[cacheKey]) {
      this.cache[cacheKey] = { data: [], timestamp: 0 };
    }
    this.cache[cacheKey].observable = request$;

    return request$;
  }

  private updateCacheWithNewProduct(newProduct: Product): void {
    const cacheKey = 'products_all';
    if (this.cache[cacheKey]) {
      this.cache[cacheKey] = {
        data: [...this.cache[cacheKey].data, newProduct],
        timestamp: Date.now(),
      };
    } else {
      this.invalidateCache();
    }
  }

  private updateCacheWithUpdatedProduct(updatedProduct: Product): void {
    const cacheKey = 'products_all';
    if (this.cache[cacheKey]) {
      this.cache[cacheKey] = {
        data: this.cache[cacheKey].data.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        ),
        timestamp: Date.now(),
      };
    } else {
      this.invalidateCache();
    }
  }

  private updateCacheAfterDelete(id: number): void {
    const cacheKey = 'products_all';
    if (this.cache[cacheKey]) {
      this.cache[cacheKey] = {
        data: this.cache[cacheKey].data.filter((p) => p.id !== id),
        timestamp: Date.now(),
      };
    } else {
      this.invalidateCache();
    }
  }

  private updateCache(key: string, data: Product[]): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }

  private isCacheExpired(key: string): boolean {
    return Date.now() - this.cache[key].timestamp > this.CACHE_TTL;
  }

  invalidateCache(): void {
    this.cache = {};
  }

  invalidateKey(key: string): void {
    delete this.cache[key];
  }
}
