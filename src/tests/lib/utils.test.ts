import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      const result = cn('base-class', 'additional-class');
      expect(result).toBe('base-class additional-class');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class active-class');
    });

    it('removes falsy values', () => {
      const shouldShow = false;
      const result = cn('base-class', shouldShow && 'false-class', null, undefined);
      expect(result).toBe('base-class');
    });

    it('handles empty strings', () => {
      const result = cn('base-class', '');
      expect(result).toBe('base-class');
    });

    it('handles null and undefined', () => {
      const result = cn('base-class', null, undefined);
      expect(result).toBe('base-class');
    });
  });
});
