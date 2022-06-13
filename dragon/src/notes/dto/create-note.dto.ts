import { Visibility } from '@prisma/client';

export class CreateNoteDto {
  name: string;
  content: string;
  description?: string;
  visibility: Visibility;
}
