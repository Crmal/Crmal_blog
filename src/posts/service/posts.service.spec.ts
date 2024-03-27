import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

import { Post } from '../entity/post.entity';
import { PostException, PostExceptionType } from '../exception';

import { PostFactory } from './Factory/post.factory';
import { PostCreateRequest } from './dto/postCreateRequest.dto';
import { PostsService } from './posts.service';

const mockPostRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockPostFactory = {
  create: jest.fn(),
};

const mockUserService = {
  findOneById: jest.fn(),
};

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Post>;
  let postFactory: PostFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockPostRepository },
        { provide: PostFactory, useValue: mockPostFactory },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    const userId = '1';
    const postCreateRequest: PostCreateRequest = {
      title: 'testTitle',
      description: 'testDescription',
    };
    it('should create a post', async () => {
      // Given
      mockUserService.findOneById.mockReturnValue(userId);
      mockPostFactory.create.mockReturnValue({ id: 1, ...postCreateRequest });
      mockPostRepository.save.mockReturnValue(postCreateRequest);
      // When
      const result = await service.create(postCreateRequest, userId);

      // Then
      expect(result).toEqual(expect.objectContaining(postCreateRequest));
    });
  });

  describe('findOne()', () => {
    const found = {
      id: '1',
      title: 'Test Title',
      description: 'Test Description',
      userId: '1',
    };
    it('post하나를 가져옵니다.', async () => {
      // Given
      mockPostRepository.findOne.mockReturnValue(found);
      // When
      const result = await service.findOneById(found.id);

      // Then
      expect(result).toEqual(found);
    });

    it('Post가 없을시 에러를 던집니다.', async () => {
      // Given
      jest.spyOn(mockPostRepository, 'findOne').mockResolvedValue(null);
      // When, Then
      await expect(service.findOneById('6')).rejects.toThrow(
        new PostException(PostExceptionType.NOT_FOUND_POST),
      );
    });
  });
});
