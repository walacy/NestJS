import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from '../dtos/create-note.dto';
import { Note } from '../models/note.model';
import { NotesRepositoryPort } from '../repositories/ports/notes.repository.port';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepositoryPort) {}

  create(createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesRepository.create({
      title: createNoteDto.title,
      content: createNoteDto.content,
    });
  }

  findAll(): Promise<Note[]> {
    return this.notesRepository.findAll();
  }

  async findSince(since: string): Promise<Note[]> {
    const parsedSince = new Date(since);
    if (Number.isNaN(parsedSince.getTime())) {
      throw new BadRequestException('Since date is invalid');
    }

    return this.notesRepository.findSince(parsedSince);
  }

  async findOne(id: string): Promise<Note> {
    if (!id) {
      throw new BadRequestException('Note id is required');
    }

    const note = await this.notesRepository.findOne(id);
    if (!note) {
      throw new NotFoundException(`Note with id ${id} was not found`);
    }

    return note;
  }

  clear(): Promise<void> {
    return this.notesRepository.clear();
  }
}
