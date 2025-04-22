import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

// Componentes
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductsComponent } from './products.component';
@NgModule({
  declarations: [
    ProductsComponent, // Componente contenedor
  ],
  imports: [
    CommonModule,
    ProductListComponent,
    ProductCardComponent,
    RouterModule.forChild([
      // Configuración de rutas del módulo
      { path: '', component: ProductListComponent }, // Ruta principal muestra ProductListComponent
    ]),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class ProductsModule {}
