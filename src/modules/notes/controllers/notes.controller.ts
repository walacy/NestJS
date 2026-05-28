import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateNoteDto } from '../dtos/create-note.dto';
import { GetNotesByDateQuery } from '../dtos/get-notes-by-date.query';
import { NotesService } from '../services/notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  findAll() {
    console.log('Finding all notes');
    return this.notesService.findAll();
  }

  @Get('since')
  findSince(@Query() query: GetNotesByDateQuery) {
    console.log('Finding notes since:', query.since);
    return this.notesService.findSince(query.since);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('Finding note with id:', id);
    return this.notesService.findOne(id);
  }
}
