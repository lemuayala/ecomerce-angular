import { Injectable, computed, signal } from '@angular/core';
import { catchError, finalize, of, switchMap, tap, throwError } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { Product } from '../../../models/product.model';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsStore {
  // Estado privado con signals
  private state = signal<ProductState>({
    products: [],
    loading: false,
    error: null,
    lastUpdated: null,
  });

  // Selectores públicos
  products = computed(() => this.state().products);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  lastUpdated = computed(() => this.state().lastUpdated);

  constructor(private productsService: ProductsService) {}

  /**
   * Operaciones CRUD
   */

  // Cargar productos
  loadProducts(refresh = false): void {
    this.#setLoading(true);
    this.#setError(null);

    this.productsService
      .getProducts(refresh)
      .pipe(
        tap((products) => {
          this.#setProducts(products);
          this.#setLastUpdated(Date.now());
        }),
        catchError((error) => {
          this.#setError('Failed to load products');
          return of([]);
        }),
        finalize(() => this.#setLoading(false))
      )
      .subscribe();
  }

  // Crear producto
  createProduct(productData: Omit<Product, 'id'>): void {
    this.#setLoading(true);
    this.#setError(null);

    this.productsService
      .createProduct(productData)
      .pipe(
        tap((newProduct) => {
          this.#addProduct(newProduct);
          this.#setLastUpdated(Date.now());
        }),
        catchError((error) => {
          this.#setError('Failed to create product');
          return throwError(() => error);
        }),
        finalize(() => this.#setLoading(false))
      )
      .subscribe();
  }

  // Actualizar producto
  updateProduct(id: number, productData: Partial<Product>): void {
    this.#setLoading(true);
    this.#setError(null);

    this.productsService
      .updateProduct(id, productData)
      .pipe(
        tap((updatedProduct) => {
          this.#updateProduct(updatedProduct);
          this.#setLastUpdated(Date.now());
        }),
        catchError((error) => {
          this.#setError('Failed to update product');
          return throwError(() => error);
        }),
        finalize(() => this.#setLoading(false))
      )
      .subscribe();
  }

  // Eliminar producto
  deleteProduct(id: number): void {
    this.#setLoading(true);
    this.#setError(null);

    this.productsService
      .deleteProduct(id)
      .pipe(
        tap(() => {
          this.#removeProduct(id);
          this.#setLastUpdated(Date.now());
        }),
        catchError((error) => {
          this.#setError('Failed to delete product');
          return throwError(() => error);
        }),
        finalize(() => this.#setLoading(false))
      )
      .subscribe();
  }

  /**
   * Métodos privados para actualizar estado
   */

  #setLoading(loading: boolean): void {
    this.state.update((s) => ({ ...s, loading }));
  }

  #setError(error: string | null): void {
    this.state.update((s) => ({ ...s, error }));
  }

  #setProducts(products: Product[]): void {
    this.state.update((s) => ({ ...s, products }));
  }

  #setLastUpdated(timestamp: number): void {
    this.state.update((s) => ({ ...s, lastUpdated: timestamp }));
  }

  #addProduct(product: Product): void {
    this.state.update((s) => ({
      ...s,
      products: [...s.products, product],
    }));
  }

  #updateProduct(updatedProduct: Product): void {
    this.state.update((s) => ({
      ...s,
      products: s.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      ),
    }));
  }

  #removeProduct(id: number): void {
    this.state.update((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== id),
    }));
  }
}
