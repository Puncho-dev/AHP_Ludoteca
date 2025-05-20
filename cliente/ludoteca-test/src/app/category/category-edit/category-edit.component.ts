import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../category.service';
import { Category } from '../model/Category';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';

@Component({
    selector: 'app-category-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
    templateUrl: './category-edit.component.html',
    styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent implements OnInit {
    category: Category = new Category;
    categoryForm: FormGroup<{ id: FormControl<any>; name: FormControl<string>; nationality: FormControl<string>; }>;
    nameError: any;

    constructor(
            public dialogRef: MatDialogRef<CategoryEditComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any,
            private categoryService: CategoryService,
            public dialog: MatDialog
        ) {}
    
        ngOnInit(): void {
            this.category = this.data.category ? Object.assign({}, this.data.category) : new Category();
    
            this.categoryForm = new FormGroup({
            id: new FormControl({ value: this.data.category?.id || '', disabled: true }),
            name: new FormControl('', Validators.required),
            nationality: new FormControl('', Validators.required)
        });
        }
    
        onSave() {  
            this.category.name = this.toCamelCase(this.category.name);
            if (this.validateName(this.category.name)){
            this.categoryService.saveCategory(this.category).subscribe({
            next: () => {
            this.dialog.open(DialogConfirmationComponent, {
              data: { title: '', description: 'La categoria se ha guardado correctamente.', confirm: false }
            });
            this.dialogRef.close();
          },
          error: (error) => {
            console.error('Error al guardar la categoria:', error);
            let errorMessage = 'Hubo un error al guardar la categoria. Por favor, inténtalo de nuevo.';
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            this.dialog.open(DialogConfirmationComponent, {
              data: { title: 'Error', description: errorMessage, confirm: false }
            });
          }
        });
      } else {
        this.dialog.open(DialogConfirmationComponent, {
          data: { title: 'Error', description: this.nameError, confirm: false }
        });
      }
    }
    
        toCamelCase(str: string): string {
        return str
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase())
        .replace(/\s+/g, ' ')
        .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())
        .replace(/\s+/g, ' ');
    }
     
    validateName(name: string): boolean {
                         
      const namePattern = /^[A-Z][a-zA-Z]*(?:\s[A-Z]\.)?(?:\s[A-Z][a-zA-Z]*)*(?:-[A-Z][a-zA-Z]*)*$/;
      if (!namePattern.test(name)) {
        this.nameError = 'El nombre debe tener al menos 3 caracteres y no contener caracteres especiales.';
        return false;
      }
      this.nameError = '';
      return true;
    }
    
        onClose() {
            this.dialogRef.close();
        }
}
