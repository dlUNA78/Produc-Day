import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

/**
 * Universal Notification & Sound Service
 * Supports Capacitor Native Android APK + Web Notification API Fallback
 */

class NotificationService {
  private isNative: boolean;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.initChannels();
  }

  /**
   * Initialize Android notification channels if running in native Capacitor
   */
  private async initChannels() {
    if (this.isNative) {
      try {
        await LocalNotifications.createChannel({
          id: 'gym_alerts',
          name: 'Alertas de Entrenamiento',
          description: 'Avisos de descansos completados y rutinas del gimnasio',
          importance: 5, // High importance for heads-up alert & sound
          visibility: 1,
          vibration: true,
          sound: 'beep.wav',
        });
      } catch (e) {
        console.warn('Capacitor channel creation skipped:', e);
      }
    }
  }

  /**
   * Check current permission status
   */
  async getPermissionStatus(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
    if (this.isNative) {
      try {
        const res = await LocalNotifications.checkPermissions();
        if (res.display === 'granted') return 'granted';
        if (res.display === 'denied') return 'denied';
        return 'prompt';
      } catch {
        return 'prompt';
      }
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') return 'granted';
      if (Notification.permission === 'denied') return 'denied';
      return 'prompt';
    }

    return 'unsupported';
  }

  /**
   * Request permission from user
   */
  async requestPermission(): Promise<boolean> {
    if (this.isNative) {
      try {
        const res = await LocalNotifications.requestPermissions();
        return res.display === 'granted';
      } catch (e) {
        console.error('Error requesting Capacitor notification permission:', e);
        return false;
      }
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (e) {
        console.error('Error requesting Web notification permission:', e);
        return false;
      }
    }

    return false;
  }

  /**
   * Synthesize an alert sound using Web Audio API
   */
  playAlertSound() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      
      // Dual-tone high clarity chime (E5 -> B5)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.15); // B5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1318.5, now); // E6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch (e) {
      // Audio context may be restricted by browser policy
    }
  }

  /**
   * Trigger physical haptic vibration if supported
   */
  triggerHaptic() {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([120, 80, 200]);
      }
    } catch {
      // Ignore vibration errors
    }
  }

  /**
   * Send an immediate notification
   */
  async sendNotification(title: string, body: string, id: number = Date.now() % 100000) {
    // Play sound and haptic vibration
    this.playAlertSound();
    this.triggerHaptic();

    if (this.isNative) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id,
              channelId: 'gym_alerts',
              smallIcon: 'ic_stat_notification',
              iconColor: '#00E699',
            },
          ],
        });
        return;
      } catch (e) {
        console.warn('Capacitor schedule error, falling back to Web API', e);
      }
    }

    // Web Notification fallback
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Web notification error:', e);
      }
    }
  }

  /**
   * Schedule a notification in the future (e.g. for gym rest timer when app is backgrounded)
   */
  async scheduleTimerEnd(seconds: number, exerciseName?: string): Promise<number> {
    const notifId = Math.floor(Date.now() / 1000) % 100000;
    const scheduleDate = new Date(Date.now() + seconds * 1000);
    const title = '⏱️ ¡Descanso Terminado!';
    const body = exerciseName 
      ? `Tiempo cumplido para continuar con ${exerciseName}. ¡A darle!`
      : 'Tiempo cumplido. ¡Listo para tu siguiente serie!';

    if (this.isNative) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: notifId,
              schedule: { at: scheduleDate },
              channelId: 'gym_alerts',
              smallIcon: 'ic_stat_notification',
              iconColor: '#00E699',
            },
          ],
        });
        return notifId;
      } catch (e) {
        console.warn('Capacitor future notification failed:', e);
      }
    }

    return notifId;
  }

  /**
   * Cancel a previously scheduled notification
   */
  async cancelNotification(id: number) {
    if (this.isNative) {
      try {
        await LocalNotifications.cancel({
          notifications: [{ id }],
        });
      } catch (e) {
        console.warn('Error cancelling notification:', e);
      }
    }
  }

  /**
   * Schedule daily gym reminder
   */
  async scheduleDailyReminder(hour: number, minute: number) {
    if (!this.isNative) return;

    try {
      // Cancel previous reminder with fixed ID 9999
      await LocalNotifications.cancel({ notifications: [{ id: 9999 }] });

      await LocalNotifications.schedule({
        notifications: [
          {
            title: '🏋️ Hora de entrenar',
            body: 'Tu sesión del día te espera en Agenda & Gym. ¡Mantén la racha!',
            id: 9999,
            schedule: {
              on: {
                hour,
                minute,
              },
              allowWhileIdle: true,
            },
            channelId: 'gym_alerts',
          },
        ],
      });
    } catch (e) {
      console.warn('Error scheduling daily reminder:', e);
    }
  }
}

export const notificationService = new NotificationService();
