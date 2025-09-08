import React, { useState, useEffect } from 'react';
import { PropertySuccessNotification } from './PropertySuccessNotification';
import { PhotoUploadReminder } from './PhotoUploadReminder';
import { PropertyProgressNotification } from './PropertyProgressNotification';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { calculatePropertyCompletion, calculatePGPropertyCompletion } from '@/utils/propertyCompletion';

interface Notification {
  id: string;
  type: 'success' | 'photo_reminder' | 'progress';
  propertyId: string;
  propertyTitle: string;
  createdAt: string;
  dismissed?: boolean;
  completionPercentage?: number;
  missingFields?: string[];
  propertyType?: string;
}

interface NotificationManagerProps {
  onNotificationDismissed?: (notificationId: string) => void;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  onNotificationDismissed
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get recent properties (last 7 days) that might need notifications
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, title, images, created_at, status')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const newNotifications: Notification[] = [];

      properties?.forEach(property => {
        const createdAt = new Date(property.created_at);
        const now = new Date();
        const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        // Add success notification for recently posted properties (last 24 hours)
        if (hoursSinceCreation <= 24 && property.status === 'approved') {
          newNotifications.push({
            id: `success-${property.id}`,
            type: 'success',
            propertyId: property.id,
            propertyTitle: property.title,
            createdAt: property.created_at
          });
        }

        // Add photo reminder for properties without images (last 7 days)
        if (hoursSinceCreation <= 168 && (!property.images || property.images.length === 0)) {
          newNotifications.push({
            id: `photo-${property.id}`,
            type: 'photo_reminder',
            propertyId: property.id,
            propertyTitle: property.title,
            createdAt: property.created_at
          });
        }

        // Add progress notification for incomplete properties (last 30 days, completion < 80%)
        if (hoursSinceCreation <= 720 && property.status === 'approved') {
          const completion = property.property_type === 'pg_hostel' 
            ? calculatePGPropertyCompletion(property as any)
            : calculatePropertyCompletion(property);
          
          if (completion.percentage < 80) {
            newNotifications.push({
              id: `progress-${property.id}`,
              type: 'progress',
              propertyId: property.id,
              propertyTitle: property.title,
              createdAt: property.created_at,
              completionPercentage: completion.percentage,
              missingFields: completion.missingFields,
              propertyType: property.property_type
            });
          }
        }
      });

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    
    if (onNotificationDismissed) {
      onNotificationDismissed(notificationId);
    }
  };

  const markAsNoPhotos = async (propertyId: string) => {
    try {
      // Update property to indicate user doesn't have photos
      // This could be a flag in the database or we could just dismiss the notification
      const { error } = await supabase
        .from('properties')
        .update({ 
          // Add a field to track that user confirmed no photos
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  if (loading) {
    return null;
  }

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {notifications.map(notification => {
        if (notification.type === 'success') {
          return (
            <PropertySuccessNotification
              key={notification.id}
              propertyId={notification.propertyId}
              propertyTitle={notification.propertyTitle}
              onDismiss={() => dismissNotification(notification.id)}
            />
          );
        }

        if (notification.type === 'photo_reminder') {
          return (
            <PhotoUploadReminder
              key={notification.id}
              propertyId={notification.propertyId}
              propertyTitle={notification.propertyTitle}
              onDismiss={() => dismissNotification(notification.id)}
              onMarkAsNoPhotos={() => markAsNoPhotos(notification.propertyId)}
            />
          );
        }

        if (notification.type === 'progress') {
          return (
            <PropertyProgressNotification
              key={notification.id}
              propertyId={notification.propertyId}
              propertyTitle={notification.propertyTitle}
              completionPercentage={notification.completionPercentage || 0}
              missingFields={notification.missingFields || []}
              propertyType={notification.propertyType}
              onDismiss={() => dismissNotification(notification.id)}
            />
          );
        }

        return null;
      })}
    </div>
  );
};
