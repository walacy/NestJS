import { IsDateString } from 'class-validator';

export class GetNotesByDateQuery {
  @IsDateString()
  since!: string;
}