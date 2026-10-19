export interface NotificationItem {
  id: string;
  userId: string;
  type: 'GUARDIAN' | 'MATCH' | 'PROPOSAL' | 'VERIFICATION' | 'SYSTEM';
  title: string;
  message: string;
  actionUrl: string;
  read: boolean;
  createdAt: string;
}

class NotificationService {
  private notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      userId: 'default-user',
      type: 'GUARDIAN',
      title: 'Guardian Invite Accepted',
      message: 'Tariq Khan (Father) accepted your Guardian Invite and joined your Family Workspace.',
      actionUrl: '/family',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
    },
    {
      id: 'notif-2',
      userId: 'default-user',
      type: 'MATCH',
      title: 'New High Compatibility Match',
      message: 'You have a new 94% compatibility match (Fatima Zahra) in Lahore!',
      actionUrl: '/dashboard',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
    },
    {
      id: 'notif-3',
      userId: 'default-user',
      type: 'PROPOSAL',
      title: 'Interest Expressed',
      message: 'Zara Khan expressed interest in your matrimonial profile.',
      actionUrl: '/proposals',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() // 3 hours ago
    },
    {
      id: 'notif-4',
      userId: 'default-user',
      type: 'VERIFICATION',
      title: 'Badge Approved',
      message: 'Your Higher Education Badge (LUMS) was approved by Trust & Safety.',
      actionUrl: '/profile',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
    }
  ];

  getUserNotifications(userId: string = 'default-user'): NotificationItem[] {
    return this.notifications
      .filter(n => n.userId === userId || n.userId === 'default-user')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  markAsRead(id: string): NotificationItem | null {
    const item = this.notifications.find(n => n.id === id);
    if (item) {
      item.read = true;
      return item;
    }
    return null;
  }

  markAllAsRead(userId: string = 'default-user'): void {
    this.notifications.forEach(n => {
      if (n.userId === userId || n.userId === 'default-user') {
        n.read = true;
      }
    });
  }

  createNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...notif
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }
}

export const notificationService = new NotificationService();
