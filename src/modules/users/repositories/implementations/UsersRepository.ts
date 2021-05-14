import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
      const ret = await this.repository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.games", "games")
      .where("users.id = :id", { id: user_id })
      .getOne();
      
      return ret;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const ret = await this.repository
    .query("select * from users order by first_name"); // Complete usando raw query

    return ret;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {

    const query = `select * 
    from users u 
    where lower(u.first_name) = $1
    and lower(u.last_name) = $2`;
    const ret = await this.repository
    .query(query, [first_name.toLowerCase(), last_name.toLowerCase()]);
     // Complete usando raw query
     return ret;
  }
}
