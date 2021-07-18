import { SafehtmlPipe } from './safehtml.pipe';

describe('SafehtmlPipe', () => {
  it('create an instance', () => {
    let pipe = SafehtmlPipe();
    expect(pipe).toBeTruthy();
  });
});
