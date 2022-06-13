import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Note } from '@prisma/client';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(private prismaService: PrismaService) {}

  async create(args: Prisma.NoteCreateArgs): Promise<Note> {
    const newNote = await this.prismaService.note.create(args);
    this.logger.log(`Note created with id ${newNote.id}`);
    return newNote;
  }
}
