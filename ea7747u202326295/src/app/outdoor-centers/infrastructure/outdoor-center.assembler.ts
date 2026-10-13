import { OutdoorCenterEntity } from '../domain/entities/outdoor-center.entity';

export class OutdoorCenterAssembler {
  static toEntity(value: unknown): OutdoorCenterEntity {
    return value as OutdoorCenterEntity;
  }
  static toEntities(values: unknown[]): OutdoorCenterEntity[] {
    return values.map(value => this.toEntity(value));
  }
}
