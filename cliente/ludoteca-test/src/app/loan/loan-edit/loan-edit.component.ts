
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChangeDetectionStrategy } from '@angular/core';
import { Loan } from '../model/Loan';
import { Client } from '../../client/model/Client';
import { Game } from '../../game/model/Game';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../client/client.service';
import { LoanService } from '../loan.service';
import { GameService } from '../../game/game.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-loan-edit',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './loan-edit.component.html',
  styleUrl: './loan-edit.component.scss'
})
export class LoanEditComponent implements OnInit {
  loan: Loan;
  clients: Client[] = [];
  games: Game[] = [];
  loanForm: FormGroup;

  @ViewChild('dateStartPicker') dateStartPicker: MatDatepicker<Date>;
  @ViewChild('dateEndPicker') dateEndPicker: MatDatepicker<Date>;

  dateStartControl: AbstractControl;
  dateEndControl: AbstractControl;
trackById: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LoanEditComponent>,
    private loanService: LoanService,
    private clientService: ClientService,
    private gameService: GameService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loan = this.data?.loan ? { ...this.data.loan } : new Loan();

    this.loanForm = new FormGroup({
      id: new FormControl({ value: this.loan?.id || '', disabled: true }),
      game: new FormControl(this.loan?.game || '', Validators.required),
      client: new FormControl(this.loan?.client || '', Validators.required),
      dateStart: new FormControl(this.loan?.dateStart || '', Validators.required),
      dateEnd: new FormControl(this.loan?.dateEnd || '', Validators.required)
    });

    this.dateStartControl = this.loanForm.controls['dateStart'];
    this.dateEndControl = this.loanForm.controls['dateEnd'];

    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });

    this.gameService.getGames().subscribe(games => {
      this.games = games;
    });
  }

  onSave(): void {
    this.dateStartControl.setErrors(null);
    this.dateEndControl.setErrors(null);

    if (this.loanForm.valid) {
      const dateStart: Date = this.loanForm.get('dateStart')?.value;
      const dateEnd: Date = this.loanForm.get('dateEnd')?.value;

      if (!dateStart || !dateEnd) {
        if (!dateStart) this.dateStartControl.setErrors({ required: true });
        if (!dateEnd) this.dateEndControl.setErrors({ required: true });
        return;
      }

      if (dateEnd < dateStart) {
        this.dateStartControl.setErrors({ rangeOrder: true });
        this.dateEndControl.setErrors({ rangeOrder: true });
        return;
      }

      const duration = (dateEnd.getTime() - dateStart.getTime()) / (1000 * 3600 * 24);
      if (duration >= 14) {
        this.dateStartControl.setErrors({ tooLong: true });
        this.dateEndControl.setErrors({ tooLong: true });
        return;
      }

      const updatedLoan: Loan = {
        ...this.loan,
        game: this.loanForm.get('game')?.value,
        client: this.loanForm.get('client')?.value,
        dateStart,
        dateEnd
      };

      this.loanService.saveLoan(updatedLoan).subscribe({
        next: () => {
          this.dialog.open(DialogConfirmationComponent, {
            data: { title: '', description: 'El préstamo se ha guardado correctamente.', confirm: false }
          });
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error al guardar el préstamo:', error);
          this.dialog.open(DialogConfirmationComponent, {
            data: { title: 'Error', description: 'Hubo un error al guardar el préstamo. Por favor, inténtalo de nuevo.', confirm: false }
          });
        }
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
