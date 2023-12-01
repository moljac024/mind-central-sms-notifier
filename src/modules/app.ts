import {DB} from './db';

import {useStore} from './store';

export async function init() {
  console.log('Initializing app...');

  // Initialize the database
  await DB.initializeDatabase();

  // Run initial actions
  const store = useStore.getState();
  await store.actions.checkVersion();
  await store.actions.checkForPermissions();

  console.log('App initialized.');
}
