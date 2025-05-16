import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthorService } from '../author.service';
import { Author } from '../model/Author';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';

@Component({
    selector: 'app-author-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
    templateUrl: './author-edit.component.html',
    styleUrl: './author-edit.component.scss',
})
export class AuthorEditComponent implements OnInit {
    author!: Author;
    nameError: string;
    authorForm: any;

    constructor(
        public dialogRef: MatDialogRef<AuthorEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private authorService: AuthorService,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.author = this.data.author ? Object.assign({}, this.data.author) : new Author();

        this.authorForm = new FormGroup({
        id: new FormControl({ value: this.data.author?.id || '', disabled: true }),
        name: new FormControl('', Validators.required),
        nationality: new FormControl('', Validators.required)
    });
    }

    onSave() {  
        this.author.name = this.toCamelCase(this.author.name);
        if (this.validateName(this.author.name)){
        this.authorService.saveAuthor(this.author).subscribe({
        next: () => {
        this.dialog.open(DialogConfirmationComponent, {
          data: { title: '', description: 'El autor se ha guardado correctamente.', confirm: false }
        });
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error al guardar el autor:', error);
        let errorMessage = 'Hubo un error al guardar el autor. Por favor, inténtalo de nuevo.';
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
