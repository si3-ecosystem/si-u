/**
 * Utility to detect temporary email addresses
 * Identifies wallet-generated temporary emails and other temp email patterns
 */

export class TempEmailDetector {
  /**
   * Common temporary email patterns
   */
  private static readonly TEMP_EMAIL_PATTERNS = [
    // Wallet-generated temp emails
    /@wallet\.temp$/i,
    /@temp\.wallet$/i,
    /@wallet\.temporary$/i,
    /@temporary\.wallet$/i,
    
    // Common temp email services
    /@10minutemail\./i,
    /@guerrillamail\./i,
    /@mailinator\./i,
    /@tempmail\./i,
    /@temp-mail\./i,
    /@throwaway\./i,
    /@disposable\./i,
    /@temporary\./i,
    /@temp\./i,
    /@fake\./i,
    /@dummy\./i,
    /@test\./i,
    /@example\./i,
    /@sample\./i,
    
    // Specific temp email domains
    /@yopmail\./i,
    /@maildrop\./i,
    /@sharklasers\./i,
    /@grr\.la$/i,
    /@guerrillamailblock\./i,
    /@pokemail\./i,
    /@spam4\./i,
    /@bccto\./i,
    /@chacuo\./i,
    /@dispostable\./i,
    /@emailondeck\./i,
    /@fakeinbox\./i,
    /@hide\./i,
    /@mytrashmail\./i,
    /@no-spam\./i,
    /@nowmymail\./i,
    /@objectmail\./i,
    /@proxymail\./i,
    /@rcpt\./i,
    /@safe-mail\./i,
    /@sneakemail\./i,
    /@sogetthis\./i,
    /@spambog\./i,
    /@spamex\./i,
    /@spamfree24\./i,
    /@spamhole\./i,
    /@spamify\./i,
    /@spamthisplease\./i,
    /@superrito\./i,
    /@tempemail\./i,
    /@tempinbox\./i,
    /@trashymail\./i,
    /@trbvm\./i,
    /@wegwerfmail\./i,
    /@zehnminutenmail\./i,
  ];

  /**
   * Wallet address patterns that might be used in temp emails
   */
  private static readonly WALLET_ADDRESS_PATTERNS = [
    // Ethereum-style addresses (0x followed by 40 hex characters)
    /0x[a-fA-F0-9]{40}@/,
    
    // Bitcoin-style addresses
    /[13][a-km-zA-HJ-NP-Z1-9]{25,34}@/,
    /bc1[a-z0-9]{39,59}@/,
    
    // Other common crypto address patterns
    /[a-zA-Z0-9]{26,35}@.*\.(temp|temporary|wallet)$/i,
  ];

  /**
   * Check if an email address is a temporary email
   */
  static isTempEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check against temp email patterns
    for (const pattern of this.TEMP_EMAIL_PATTERNS) {
      if (pattern.test(normalizedEmail)) {
        console.log(`[TempEmailDetector] Detected temp email pattern: ${pattern.source} for email: ${email}`);
        return true;
      }
    }

    // Check against wallet address patterns
    for (const pattern of this.WALLET_ADDRESS_PATTERNS) {
      if (pattern.test(normalizedEmail)) {
        console.log(`[TempEmailDetector] Detected wallet address pattern: ${pattern.source} for email: ${email}`);
        return true;
      }
    }

    return false;
  }

  /**
   * Check if an email looks like a wallet-generated temporary email
   */
  static isWalletTempEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for wallet address patterns specifically
    for (const pattern of this.WALLET_ADDRESS_PATTERNS) {
      if (pattern.test(normalizedEmail)) {
        return true;
      }
    }

    // Check for wallet-specific temp domains
    const walletTempPatterns = [
      /@wallet\.temp$/i,
      /@temp\.wallet$/i,
      /@wallet\.temporary$/i,
      /@temporary\.wallet$/i,
    ];

    for (const pattern of walletTempPatterns) {
      if (pattern.test(normalizedEmail)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get the type of temporary email detected
   */
  static getTempEmailType(email: string): 'wallet' | 'service' | 'none' {
    if (!email || typeof email !== 'string') {
      return 'none';
    }

    if (this.isWalletTempEmail(email)) {
      return 'wallet';
    }

    if (this.isTempEmail(email)) {
      return 'service';
    }

    return 'none';
  }

  /**
   * Extract wallet address from temp email if possible
   */
  static extractWalletAddress(email: string): string | null {
    if (!email || typeof email !== 'string') {
      return null;
    }

    // Try to extract Ethereum-style address
    const ethMatch = email.match(/0x[a-fA-F0-9]{40}/);
    if (ethMatch) {
      return ethMatch[0];
    }

    // Try to extract Bitcoin-style address
    const btcMatch = email.match(/[13][a-km-zA-HJ-NP-Z1-9]{25,34}/);
    if (btcMatch) {
      return btcMatch[0];
    }

    const bech32Match = email.match(/bc1[a-z0-9]{39,59}/);
    if (bech32Match) {
      return bech32Match[0];
    }

    return null;
  }

  /**
   * Validate if an email should be considered "verified" for wallet operations
   * Temp emails are considered unverified for wallet disconnect purposes
   */
  static isEmailValidForWalletOperations(email: string, isVerified: boolean): boolean {
    if (!email || !isVerified) {
      return false;
    }

    // If it's a temp email, don't allow wallet disconnect even if "verified"
    if (this.isTempEmail(email)) {
      return false;
    }

    return true;
  }
}
