import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductService } from '../../services/product.service';
import { CreateProductRequest } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzButtonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  @Output() productCreated = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  productForm: FormGroup;
  isSubmitting = false;
  
  productTypes = [
    { label: 'Medicação', value: 'medication' },
    { label: 'Vitamina', value: 'vitamin' },
    { label: 'Suplemento', value: 'supplement' },
    { label: 'Higiene', value: 'hygiene' },
    { label: 'Beleza', value: 'beauty' },
    { label: 'Outros', value: 'others' }
  ];
  
  private productService = inject(ProductService);
  private message = inject(NzMessageService);
  private fb = inject(FormBuilder);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      type: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      const productData: CreateProductRequest = {
        name: this.productForm.value.name.trim(),
        price: parseFloat(this.productForm.value.price),
        type: this.productForm.value.type
      };

      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.message.success('Produto cadastrado com sucesso!');
          this.productForm.reset();
          this.productCreated.emit();
        },
        error: (error) => {
          this.isSubmitting = false;
          const errorMessage = error.error?.message || 'Erro ao cadastrar produto. Tente novamente.';
          this.message.error(errorMessage);
        }
      });
    } else {
      Object.values(this.productForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onCancel(): void {
    this.productForm.reset();
    this.cancelled.emit();
  }

  formatPriceInput = (value: number): string => {
    return value ? value.toFixed(2) : '';
  }

  parsePriceInput = (value: string): number => {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  }
}
