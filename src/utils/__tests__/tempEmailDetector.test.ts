/**
 * Tests for TempEmailDetector utility
 */

import { TempEmailDetector } from '../tempEmailDetector';

describe('TempEmailDetector', () => {
  describe('isTempEmail', () => {
    it('should detect wallet temp emails', () => {
      const walletTempEmails = [
        '0xa635b319a6bec867167331ef3b8578887a8d4397@wallet.temp',
        '0x1234567890123456789012345678901234567890@temp.wallet',
        'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh@wallet.temporary',
        '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa@temporary.wallet',
      ];

      walletTempEmails.forEach(email => {
        expect(TempEmailDetector.isTempEmail(email)).toBe(true);
      });
    });

    it('should detect common temp email services', () => {
      const tempEmails = [
        'test@10minutemail.com',
        'user@guerrillamail.com',
        'temp@mailinator.com',
        'fake@tempmail.org',
        'dummy@yopmail.com',
        'test@maildrop.cc',
      ];

      tempEmails.forEach(email => {
        expect(TempEmailDetector.isTempEmail(email)).toBe(true);
      });
    });

    it('should not detect legitimate emails as temp', () => {
      const legitimateEmails = [
        'user@gmail.com',
        'test@company.com',
        'admin@example.org',
        'contact@business.net',
        'support@service.io',
      ];

      legitimateEmails.forEach(email => {
        expect(TempEmailDetector.isTempEmail(email)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(TempEmailDetector.isTempEmail('')).toBe(false);
      expect(TempEmailDetector.isTempEmail(null as any)).toBe(false);
      expect(TempEmailDetector.isTempEmail(undefined as any)).toBe(false);
      expect(TempEmailDetector.isTempEmail('invalid-email')).toBe(false);
    });
  });

  describe('isWalletTempEmail', () => {
    it('should detect wallet-specific temp emails', () => {
      const walletEmails = [
        '0xa635b319a6bec867167331ef3b8578887a8d4397@wallet.temp',
        '0x1234567890123456789012345678901234567890@temp.wallet',
        'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh@wallet.temporary',
      ];

      walletEmails.forEach(email => {
        expect(TempEmailDetector.isWalletTempEmail(email)).toBe(true);
      });
    });

    it('should not detect non-wallet temp emails as wallet temp', () => {
      const nonWalletEmails = [
        'test@10minutemail.com',
        'user@guerrillamail.com',
        'temp@mailinator.com',
        'user@gmail.com',
      ];

      nonWalletEmails.forEach(email => {
        expect(TempEmailDetector.isWalletTempEmail(email)).toBe(false);
      });
    });
  });

  describe('getTempEmailType', () => {
    it('should return correct type for wallet temp emails', () => {
      expect(TempEmailDetector.getTempEmailType('0xa635b319a6bec867167331ef3b8578887a8d4397@wallet.temp')).toBe('wallet');
    });

    it('should return correct type for service temp emails', () => {
      expect(TempEmailDetector.getTempEmailType('test@10minutemail.com')).toBe('service');
    });

    it('should return none for legitimate emails', () => {
      expect(TempEmailDetector.getTempEmailType('user@gmail.com')).toBe('none');
    });
  });

  describe('extractWalletAddress', () => {
    it('should extract Ethereum addresses', () => {
      const email = '0xa635b319a6bec867167331ef3b8578887a8d4397@wallet.temp';
      expect(TempEmailDetector.extractWalletAddress(email)).toBe('0xa635b319a6bec867167331ef3b8578887a8d4397');
    });

    it('should extract Bitcoin addresses', () => {
      const email = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa@wallet.temp';
      expect(TempEmailDetector.extractWalletAddress(email)).toBe('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
    });

    it('should return null for non-wallet emails', () => {
      expect(TempEmailDetector.extractWalletAddress('user@gmail.com')).toBe(null);
    });
  });

  describe('isEmailValidForWalletOperations', () => {
    it('should return false for temp emails even if verified', () => {
      expect(TempEmailDetector.isEmailValidForWalletOperations('0xa635b319a6bec867167331ef3b8578887a8d4397@wallet.temp', true)).toBe(false);
    });

    it('should return false for unverified legitimate emails', () => {
      expect(TempEmailDetector.isEmailValidForWalletOperations('user@gmail.com', false)).toBe(false);
    });

    it('should return true for verified legitimate emails', () => {
      expect(TempEmailDetector.isEmailValidForWalletOperations('user@gmail.com', true)).toBe(true);
    });

    it('should handle edge cases', () => {
      expect(TempEmailDetector.isEmailValidForWalletOperations('', true)).toBe(false);
      expect(TempEmailDetector.isEmailValidForWalletOperations('user@gmail.com', false)).toBe(false);
    });
  });
});
