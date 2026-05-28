import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { NoteEntity } from '../../entities/note.entity';
import { Note } from '../../models/note.model';
import { NotesRepositoryPort } from '../ports/notes.repository.port';

@Injectable()
export class TypeOrmNotesRepository implements NotesRepositoryPort {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
  ) {}

  async create(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
    const entity = this.noteRepository.create({
      title: note.title.trim(),
      content: note.content.trim(),
      createdAt: new Date(),
    });

    const saved = await this.noteRepository.save(entity);
    return this.toDomain(saved);
  }

  async findAll(): Promise<Note[]> {
    const notes = await this.noteRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return notes.map((note) => this.toDomain(note));
  }

  async findSince(since: Date): Promise<Note[]> {
    const notes = await this.noteRepository.find({
      where: {
        createdAt: MoreThanOrEqual(since),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return notes.map((note) => this.toDomain(note));
  }

  async findOne(id: string): Promise<Note | null> {
    const note = await this.noteRepository.findOne({
      where: { id },
    });

    return note ? this.toDomain(note) : null;
  }

  async clear(): Promise<void> {
    await this.noteRepository.clear();
  }

  private toDomain(note: NoteEntity): Note {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
    };
  }
}