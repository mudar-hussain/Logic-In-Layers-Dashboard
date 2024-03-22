import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categoryList!: Observable<any>;
  categoryForm!: FormGroup;
  editCategoryIndex: number = -1;
  updatedCategoryValue!: string;

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      category: new FormControl('', Validators.required),
    });
    this.categoryList = this.categoryService.getCategories();
  }

  addCategory() {
    let categoryData: Category = {
      category: this.categoryForm.get('category')?.value,
    };
    this.categoryService.addCategory(categoryData);
    this.resetFormData();
  }

  onEdit(id: string, updatedCategory: string, index: number) {
    if (this.editCategoryIndex === index) {
      // Update logic
      this.categoryService.updateCategory(id, updatedCategory);
      this.editCategoryIndex = -1; // Reset edit mode
    } else {
      this.editCategoryIndex = index; // Enter edit mode
    }
  }

  updateCategory(updatedCategory: string) {
    console.log('Updated category:', updatedCategory);
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id);
  }

  cancelEdit() {
    this.editCategoryIndex = -1; // Reset edit mode
  }

  private resetFormData() {
    this.categoryForm.reset();
  }
}
