import { ReservationEntity } from '../domain/entities/reservation.entity';

export class ReservationAssembler {
  static toEntity(value: unknown): ReservationEntity { return value as ReservationEntity; }
  static toEntities(values: unknown[]): ReservationEntity[] { return values.map(value => this.toEntity(value)); }
}
