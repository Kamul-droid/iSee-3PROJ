import { PickType } from '@nestjs/swagger';
import { Comment } from '../schema/comment.schema';

export class CommentDto extends PickType(Comment, ['content']) {}
