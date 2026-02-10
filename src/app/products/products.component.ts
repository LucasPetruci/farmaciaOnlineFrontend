import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductService } from '../services/product.service';
import { Product, ProductsResponse } from '../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzPaginationModule,
    NzCardModule,
    NzSpinModule,
    NzButtonModule,
    NzTagModule,
    NzInputModule,
    NzIconModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  total = 0;
  searchValue = '';
  
  private productService = inject(ProductService);
  private message = inject(NzMessageService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (response: ProductsResponse) => {
        this.products = response.data;
        this.total = response.total;
        this.currentPage = response.current_page;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Erro ao carregar produtos. Tente novamente.';
        this.message.error(errorMessage);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  formatPrice(price: string): string {
    return parseFloat(price).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'medication': 'blue',
      'vitamin': 'green',
      'supplement': 'orange',
      'hygiene': 'cyan',
      'beauty': 'purple',
      'others': 'default'
    };
    return colors[type.toLowerCase()] || 'default';
  }

  capitalizeType(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  translateType(type: string): string {
    const translations: { [key: string]: string } = {
      'medication': 'Medicação',
      'vitamin': 'Vitamina',
      'supplement': 'Suplemento',
      'hygiene': 'Higiene',
      'beauty': 'Beleza',
      'others': 'Outros'
    };
    return translations[type.toLowerCase()] || this.capitalizeType(type);
  }

  Math = Math;
}
