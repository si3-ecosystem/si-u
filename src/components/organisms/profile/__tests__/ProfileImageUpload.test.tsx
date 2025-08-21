/**
 * Test file for ProfileImageUpload component
 * Basic validation tests for the profile image upload functionality
 */

import { ProfileImageService, PROFILE_IMAGE_CONSTRAINTS } from '@/services/profileImageService';

// Test file validation
describe('ProfileImageService', () => {
  describe('validateImageFile', () => {
    it('should accept valid image files', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = ProfileImageService.validateImageFile(validFile);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid file types', () => {
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = ProfileImageService.validateImageFile(invalidFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid image file');
    });

    it('should reject files that are too large', () => {
      const largeFile = new File(['x'.repeat(PROFILE_IMAGE_CONSTRAINTS.MAX_SIZE + 1)], 'large.jpg', { 
        type: 'image/jpeg' 
      });
      const result = ProfileImageService.validateImageFile(largeFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('5MB');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(ProfileImageService.formatFileSize(0)).toBe('0 Bytes');
      expect(ProfileImageService.formatFileSize(1024)).toBe('1 KB');
      expect(ProfileImageService.formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(ProfileImageService.formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('createPreviewUrl', () => {
    it('should create a blob URL for file preview', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const url = ProfileImageService.createPreviewUrl(file);
      expect(url).toMatch(/^blob:/);
      
      // Clean up
      ProfileImageService.revokePreviewUrl(url);
    });
  });
});

// Test constants
describe('PROFILE_IMAGE_CONSTRAINTS', () => {
  it('should have correct file size limit', () => {
    expect(PROFILE_IMAGE_CONSTRAINTS.MAX_SIZE).toBe(5 * 1024 * 1024); // 5MB
  });

  it('should have correct allowed file types', () => {
    expect(PROFILE_IMAGE_CONSTRAINTS.ALLOWED_TYPES).toContain('image/jpeg');
    expect(PROFILE_IMAGE_CONSTRAINTS.ALLOWED_TYPES).toContain('image/png');
    expect(PROFILE_IMAGE_CONSTRAINTS.ALLOWED_TYPES).toContain('image/webp');
  });

  it('should have correct max dimension', () => {
    expect(PROFILE_IMAGE_CONSTRAINTS.MAX_DIMENSION).toBe(2048);
  });
});
