import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { SuperTokensGuard } from 'src/auth/guards/supertokens.guard';
import { Session } from 'src/common/decorators/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { CreateNoteDto } from './dto';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  private readonly logger = new Logger();
  constructor(private notesService: NotesService) {}

  @UseGuards(SuperTokensGuard)
  @Post()
  async create(
    @Session() session: SessionContainer,
    @Body() createNoteDto: CreateNoteDto,
  ) {
    const userId = session.getUserId();
    return this.notesService.create({
      data: {
        name: createNoteDto.name,
        content: createNoteDto.content,
        description: createNoteDto.description,
        visibility: createNoteDto.visibility,
        ownerId: userId,
      },
    });
  }
}
