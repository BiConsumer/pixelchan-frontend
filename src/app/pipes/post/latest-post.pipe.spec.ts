import { LatestPostPipe } from './latest-post.pipe';

describe('LatestPostPipe', () => {
  it('create an instance', () => {
    const pipe = new LatestPostPipe();
    expect(pipe).toBeTruthy();
  });
});
