import { Note } from '../../models/note.model';

export abstract class NotesRepositoryPort {
  abstract create(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note>;

  abstract findAll(): Promise<Note[]>;

  abstract findSince(since: Date): Promise<Note[]>;

  abstract findOne(id: string): Promise<Note | null>;

  abstract clear(): Promise<void>;
}