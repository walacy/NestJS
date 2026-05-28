import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from './entities/note.entity';
import { NotesController } from './controllers/notes.controller';
import { NotesRepositoryPort } from './repositories/ports/notes.repository.port';
import { NotesService } from './services/notes.service';
import { TypeOrmNotesRepository } from './repositories/typeorm/typeorm-notes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity])],
  controllers: [NotesController],
  providers: [
    NotesService,
    {
      provide: NotesRepositoryPort,
      useClass: TypeOrmNotesRepository,
    },
  ],
  exports: [NotesService, NotesRepositoryPort],
})
export class NotesModule {}
