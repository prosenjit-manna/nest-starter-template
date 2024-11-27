import { postSeed } from './post-seed';
import { roleSeed } from './role-seed';
import { userSeed } from './user-seed';
import { workSpaceSeed } from './workspace-seed';
async function main() {
  try {
    await roleSeed();
    console.log('Role Seed Success');
  } catch (error) {
    console.error('Failed Role Seed', error);
  }

  try {
    await userSeed();
    console.log('User Seed Success');
  } catch (error) {
    console.error('Failed user Seed', error);
  }

  try {
    await workSpaceSeed();
    console.log('Workspace Success');
  } catch (error) {
    console.error('Failed workspace Seed', error);
  }

  try {
    await postSeed();
    console.log('Post Seed Success');
  } catch (error) {
    console.error('Failed Post Seed', error);
  }

  
}

main();
