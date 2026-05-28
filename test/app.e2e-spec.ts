import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { NotesService } from '../src/modules/notes/services/notes.service';

describe('App e2e', () => {
  let app: INestApplication;
  let notesService: NotesService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
    notesService = moduleRef.get(NotesService);
  });

  beforeEach(async () => {
    await notesService.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns health status', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('creates and retrieves a note', async () => {
    const createdResponse = await request(app.getHttpServer())
      .post('/notes')
      .send({
        title: 'E2E note',
        content: 'Created through API',
      })
      .expect(201);

    expect(createdResponse.body.title).toBe('E2E note');

    const noteId = createdResponse.body.id;

    await request(app.getHttpServer())
      .get(`/notes/${noteId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          id: noteId,
          title: 'E2E note',
          content: 'Created through API',
        });
      });
  });

  it('filters notes by date', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-28T10:00:00.000Z'));

    await request(app.getHttpServer())
      .post('/notes')
      .send({
        title: 'Old note',
        content: 'Created before filter date',
      })
      .expect(201);

    jest.setSystemTime(new Date('2026-05-28T12:00:00.000Z'));

    const newNoteResponse = await request(app.getHttpServer())
      .post('/notes')
      .send({
        title: 'New note',
        content: 'Created after filter date',
      })
      .expect(201);

    const notesSinceNoon = await request(app.getHttpServer())
      .get('/notes/since')
      .query({ since: '2026-05-28T12:00:00.000Z' })
      .expect(200);

    expect(notesSinceNoon.body).toHaveLength(1);
    expect(notesSinceNoon.body[0]).toMatchObject({
      id: newNoteResponse.body.id,
      title: 'New note',
      content: 'Created after filter date',
    });

    jest.useRealTimers();
  });

  it('rejects invalid note payloads', async () => {
    await request(app.getHttpServer())
      .post('/notes')
      .send({
        title: '',
        content: '',
      })
      .expect(400);
  });
});
