import { api } from '../lib/api';
import { sum } from './sum';

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', async () => {
    const posts = await api.get('/posts/');
    console.log(posts.data[0]);
    expect(sum(1, 2)).toBe(3);
  });
});