import { Component, computed, inject, signal } from '@angular/core';
import { ProductsStore } from '../../store/products.store';
import { ProductCardComponent } from '../product-card/product-card.component';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../services/products.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, NgIf, NgFor, AsyncPipe, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  private store = inject(ProductsStore);
  private productsService = inject(ProductsService);

  // Señales del store
  products = this.store.products;
  loading = this.store.loading;
  error = this.store.error;

  // Búsqueda reactiva
  searchQuery = signal('');
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.products().filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  });

  // Auto-desuscripción con takeUntilDestroyed
  products$ = toSignal(
    this.productsService.getProducts().pipe(takeUntilDestroyed()),
    { initialValue: [] }
  );

  constructor() {
    this.store.loadProducts();
  }

  refreshProducts(): void {
    this.store.loadProducts(true); // Fuerza refresh
  }

  updateSearch(query: string): void {
    this.searchQuery.set(query);
  }
}
