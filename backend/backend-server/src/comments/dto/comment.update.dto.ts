import { PartialType } from '@nestjs/swagger';
import { Comment } from '../schema/comment.schema';

export class CommentUpdateDto extends PartialType(Comment) {}
