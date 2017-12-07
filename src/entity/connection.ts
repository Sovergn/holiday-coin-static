import { createConnection, Connection } from "typeorm";

var CONNECTION: Connection|null = null;

export async function getConnection (): Promise<Connection|null> {
  if (!CONNECTION) {
    CONNECTION = await createConnection();
  }
  return CONNECTION;
}

export async function withConnection (callback: Function): Promise<any> {
  return await callback(await getConnection());
}
