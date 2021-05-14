import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const ret = await this.repository
      .createQueryBuilder("games")
      .where("lower(games.title) like :name", {name: '%'+param.toLowerCase()+'%'}).getMany();
      // Complete usando query builder
    return ret;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const ret = await this.repository
    .query("select count(*) from games g"); // Complete usando raw query

    return ret;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    
   const games = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("games.users", "users")
      .where("games.id = :id", {id})
      .getMany().then(ret => ret);
      // Complete usando query builder

    console.log(games);

    const users = [];

    for (const g of games) {
      users.push(... g.users);
    }
    
    console.log(users);

    return users;
  }
}
