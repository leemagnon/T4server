import { Sequelize } from "sequelize-typescript";

/**
 * DB 연결 설정
 */
export default class Db {
  public sequelize: Sequelize;
  public path: string;

  constructor({ DB_HYO, DB_PASSWORD, DB_HOST }) { // DB_MIN -> DB_HYO 로 수정
    this.sequelize = new Sequelize({
      /**
       * host: aws ec2 endpoint
      */
      host: DB_HOST,
      database: DB_HYO,
      dialect: "mysql",
      username: "seo",
      password: DB_PASSWORD,
      storage: ":memory:",
      models: [__dirname + "/models"]
    });
  }
}
