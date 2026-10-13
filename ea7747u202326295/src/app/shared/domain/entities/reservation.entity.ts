
export interface ReservationEntity {
  id?: number;
  outdoorCenterId: number;
  activityType: ActivityType;
  participantName: string;
  participants: number;
  createdAt?: string;
}
export type ActivityType = 'hiking' | 'running' | 'cycling' | 'trekking';
