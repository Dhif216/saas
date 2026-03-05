// Sound notification service for order alerts
export const notificationService = {
  // Play alert sound
  playSound: (type: 'order' | 'completed' = 'order') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (type === 'order') {
        // Create a pleasant alert sound for new orders
        const now = audioContext.currentTime;
        
        // Oscillator 1 - higher frequency
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        
        osc1.frequency.setValueAtTime(800, now);
        osc1.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc1.start(now);
        osc1.stop(now + 0.5);
        
        // Oscillator 2 - lower frequency
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        
        osc2.frequency.setValueAtTime(600, now);
        osc2.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gain2.gain.setValueAtTime(0.2, now);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc2.start(now + 0.1);
        osc2.stop(now + 0.6);
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  },

  // Request notification permission
  requestPermission: async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        return true;
      }
      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
    }
    return false;
  },

  // Send browser notification
  sendNotification: (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'order-alert',
        requireInteraction: true,
        ...options,
      });
    }
  },

  // Keep screen awake (for restaurant display)
  keepScreenAwake: async () => {
    if ('wakeLock' in navigator) {
      try {
        await (navigator as any).wakeLock.request('screen');
      } catch (err) {
        console.log('Wake Lock API not available');
      }
    }
  },
};
