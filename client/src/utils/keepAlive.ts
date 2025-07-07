import { API_BASE_URL } from '../config/api';

/**
 * Keep the server alive by pinging the health endpoint every 14 minutes
 * This prevents Render free tier from spinning down the server
 */
export class KeepAlive {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

  /**
   * Start the keep-alive pings
   */
  start(): void {
    if (this.intervalId) {
      console.log('Keep-alive already running');
      return;
    }

    console.log('🚀 Starting keep-alive pings to prevent server idle');
    
    // Ping immediately on start
    this.ping();
    
    // Set up interval to ping every 14 minutes
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.PING_INTERVAL);
  }

  /**
   * Stop the keep-alive pings
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️ Keep-alive pings stopped');
    }
  }

  /**
   * Ping the server health endpoint
   */
  private async ping(): Promise<void> {
    try {
      const url = `${API_BASE_URL}/api/health`;
      console.log('📡 Keep-alive ping to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Keep-alive ping successful:', data.status);
      } else {
        console.warn('⚠️ Keep-alive ping failed:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ Keep-alive ping error:', error);
    }
  }
}

// Export singleton instance
export const keepAlive = new KeepAlive(); 