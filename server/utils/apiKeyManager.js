class ApiKeyManager {
  constructor(apiKeys) {
    this.apiKeys = apiKeys.filter(key => key && key.trim() !== '');
    this.currentIndex = 0;
    this.keyStatus = new Map();
    
    // Initialize all keys as available
    this.apiKeys.forEach(key => {
      this.keyStatus.set(key, {
        isBlocked: false,
        blockedUntil: null,
        requestCount: 0,
        lastUsed: null
      });
    });
    
    console.log(`🔑 API Key Manager initialized with ${this.apiKeys.length} keys`);
  }

  getCurrentKey() {
    if (this.apiKeys.length === 0) {
      throw new Error('No API keys available');
    }

    // Find next available key starting from current index
    let attempts = 0;
    while (attempts < this.apiKeys.length) {
      const key = this.apiKeys[this.currentIndex];
      const status = this.keyStatus.get(key);
      
      // Check if key is available (not blocked or block period expired)
      if (!status.isBlocked || (status.blockedUntil && Date.now() > status.blockedUntil)) {
        if (status.isBlocked && Date.now() > status.blockedUntil) {
          // Unblock the key
          status.isBlocked = false;
          status.blockedUntil = null;
          console.log(`🔓 API Key ${this.maskKey(key)} unblocked`);
        }
        
        status.lastUsed = Date.now();
        status.requestCount++;
        
        console.log(`🔑 Using API Key ${this.maskKey(key)} (Index: ${this.currentIndex}, Requests: ${status.requestCount})`);
        return key;
      }
      
      // Move to next key
      this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
      attempts++;
    }
    
    // All keys are blocked, return current key anyway (last resort)
    const fallbackKey = this.apiKeys[this.currentIndex];
    console.warn(`⚠️ All API keys are blocked, using fallback: ${this.maskKey(fallbackKey)}`);
    return fallbackKey;
  }

  markKeyAsBlocked(key, blockDurationMinutes = 60) {
    const status = this.keyStatus.get(key);
    if (status) {
      status.isBlocked = true;
      status.blockedUntil = Date.now() + (blockDurationMinutes * 60 * 1000);
      
      console.log(`🚫 API Key ${this.maskKey(key)} blocked for ${blockDurationMinutes} minutes`);
      
      // Move to next key
      this.rotateToNextKey();
    }
  }

  rotateToNextKey() {
    const oldIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
    
    console.log(`🔄 Rotated from key index ${oldIndex} to ${this.currentIndex}`);
  }

  maskKey(key) {
    if (!key || key.length < 8) return '***';
    return key.substring(0, 4) + '***' + key.substring(key.length - 4);
  }

  getStatus() {
    const status = {
      totalKeys: this.apiKeys.length,
      currentIndex: this.currentIndex,
      keys: []
    };

    this.apiKeys.forEach((key, index) => {
      const keyStatus = this.keyStatus.get(key);
      status.keys.push({
        index,
        masked: this.maskKey(key),
        isBlocked: keyStatus.isBlocked,
        blockedUntil: keyStatus.blockedUntil,
        requestCount: keyStatus.requestCount,
        lastUsed: keyStatus.lastUsed,
        isCurrent: index === this.currentIndex
      });
    });

    return status;
  }

  // Reset all blocked keys (useful for testing or manual reset)
  resetAllKeys() {
    this.apiKeys.forEach(key => {
      const status = this.keyStatus.get(key);
      status.isBlocked = false;
      status.blockedUntil = null;
    });
    console.log('🔄 All API keys reset');
  }
}

export default ApiKeyManager;