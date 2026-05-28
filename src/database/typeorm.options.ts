import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NoteEntity } from '../modules/notes/entities/note.entity';

export const typeOrmOptions: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [NoteEntity],
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
  logger: 'advanced-console',
};
