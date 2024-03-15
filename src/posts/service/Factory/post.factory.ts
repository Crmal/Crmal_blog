import { Injectable } from '@nestjs/common';
import { Post } from 'src/posts/entity/post.entity';
import { User } from 'src/user/entity/user.entity';

import { PostCreateRequest } from '../dto/postCreateRequest.dto';

@Injectable()
export class PostFactory {
  create(postCreateRequest: PostCreateRequest, user: User): Post {
    const newPost = new Post();
    newPost.title = postCreateRequest.title;
    newPost.description = postCreateRequest.description;
    newPost.user = user;
    return newPost;
  }
}
