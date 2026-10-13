import { ActivityType } from '../../../shared/domain/entities/reservation.entity';

export interface OutdoorCenterEntity {
  id: number;
  name: string;
  activityType: ActivityType;
  capacity: number;
  latitude: number;
  longitude: number;
}
