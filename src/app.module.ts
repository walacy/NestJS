import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { typeOrmOptions } from './database/typeorm.options';
import { NotesModule } from './modules/notes/notes.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmOptions), NotesModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
