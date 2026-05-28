import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesRepositoryPort } from '../repositories/ports/notes.repository.port';

class InMemoryNotesRepository implements NotesRepositoryPort {
  private notes: Array<{ id: string; title: string; content: string; createdAt: string }> = [];

  async create(note: { title: string; content: string }) {
    const created = {
      id: `note-${this.notes.length + 1}`,
      title: note.title.trim(),
      content: note.content.trim(),
      createdAt: new Date().toISOString(),
    };

    this.notes.unshift(created);
    return created;
  }

  async findAll() {
    return [...this.notes];
  }

  async findSince(since: Date) {
    return this.notes.filter((note) => new Date(note.createdAt).getTime() >= since.getTime());
  }

  async findOne(id: string) {
    return this.notes.find((note) => note.id === id) ?? null;
  }

  async clear() {
    this.notes = [];
  }
}

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(() => {
    service = new NotesService(new InMemoryNotesRepository());
  });

  it('creates and stores a note', async () => {
    const note = await service.create({
      title: '  First note  ',
      content: '  Content  ',
    });

    expect(note.title).toBe('First note');
    expect(note.content).toBe('Content');
    expect(await service.findAll()).toHaveLength(1);
  });

  it('finds a note by id', async () => {
    const created = await service.create({
      title: 'Title',
      content: 'Content',
    });

    await expect(service.findOne(created.id)).resolves.toEqual(created);
  });

  it('throws when note id is missing', () => {
    return expect(service.findOne('')).rejects.toThrow(BadRequestException);
  });

  it('throws when note is not found', () => {
    return expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException);
  });

  it('filters notes by created date', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-28T10:00:00.000Z'));

    await service.create({
      title: 'Old note',
      content: 'Old content',
    });

    jest.setSystemTime(new Date('2026-05-28T12:00:00.000Z'));

    await service.create({
      title: 'New note',
      content: 'New content',
    });

    const notesSinceNoon = await service.findSince('2026-05-28T12:00:00.000Z');

    expect(notesSinceNoon).toHaveLength(1);
    expect(notesSinceNoon[0].title).toBe('New note');

    jest.useRealTimers();
  });
});
