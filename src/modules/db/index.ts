import {MakeDB} from '../../lib/db';
import {migrations} from './migrations';

const MAIN_DB_NAME = 'main.db';

export const DB = MakeDB({db: {name: MAIN_DB_NAME}, migrations});
