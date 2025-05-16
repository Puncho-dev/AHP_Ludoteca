import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GameService } from '../game.service';
import { Game } from '../model/Game';
import { AuthorService } from '../../author/author.service';
import { Author } from '../../author/model/Author';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/model/Category';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';

@Component({
    selector: 'app-game-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule ],
    templateUrl: './game-edit.component.html',
    styleUrl: './game-edit.component.scss',
})
export class GameEditComponent implements OnInit{
  game: Game;
  authors: Author[];
  categories: Category[];
  nameError: string;
  gameForm: any;
 
  constructor(
      public dialogRef: MatDialogRef<GameEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data : {game : Game},
      private gameService: GameService,
      private categoryService: CategoryService,
      private authorService: AuthorService,
      public dialog: MatDialog,
 
  ) {}
 
 ngOnInit(): void {
   this.game = this.data.game ? Object.assign({}, this.data.game) : new Game(); 
   this.gameForm = new FormGroup({
     id: new FormControl({ value: this.data.game?.id || '', disabled: true }),
     title: new FormControl(this.data.game?.title || '', [Validators.required, this.validateName.bind(this)]),
     age: new FormControl(this.data.game?.age || '', [Validators.required, this.validateAge.bind(this)]),
     author: new FormControl(this.data.game?.author || '', Validators.required),
     category: new FormControl(this.data.game?.category || '', Validators.required)
   });
 
   this.categoryService.getCategories().subscribe((categories) => {
     this.categories = categories;
   });
 
   this.authorService.getAllAuthors().subscribe((authors) => {
     this.authors = authors;
   });
 }
 
 onSave() {
   if (this.gameForm.valid) {
     const game: Game = this.gameForm.value;
     game.title = this.toCamelCase(game.title);
     this.gameService.saveGame(game).subscribe({
       next: () => {
         this.dialog.open(DialogConfirmationComponent, {
           data: { title: '', description: 'El juego se ha guardado correctamente.', confirm: false }
         });
         this.dialogRef.close();
       },
       error: (error) => {
         console.error('Error al guardar el juego:', error);
         let errorMessage = 'Hubo un error al guardar el juego. Por favor, inténtalo de nuevo.';
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
 
validateAge(age: number): boolean {
  if (age <= 0) {
  this.nameError = 'La edad debe ser mayor que 0.';
    return false;
  }
  this.nameError = '';
  return true;
  }
 
 
  onClose() {
      this.dialogRef.close();
  }
 
}
 