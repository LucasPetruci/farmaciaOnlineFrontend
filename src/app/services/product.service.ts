import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsResponse, Product, CreateProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(page: number = 1, perPage: number = 10): Observable<ProductsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    
    return this.http.get<ProductsResponse>('/products', { params });
  }

  createProduct(product: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>('/products', product);
  }

  updateProduct(id: number, product: CreateProductRequest): Observable<Product> {
    return this.http.put<Product>(`/products/${id}`, product);
  }
}
