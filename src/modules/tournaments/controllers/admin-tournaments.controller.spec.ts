import { Test, TestingModule } from '@nestjs/testing';
import { AdminTournamentsController } from './admin-tournaments.controller';

describe('AdminTournamentsController', () => {
  let controller: AdminTournamentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminTournamentsController],
    }).compile();

    controller = module.get<AdminTournamentsController>(AdminTournamentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
