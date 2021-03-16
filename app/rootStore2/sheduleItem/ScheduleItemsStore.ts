import { observable } from 'mobx';
import { injectable } from 'inversify';

import { ScheduleItem } from 'rootStore2/sheduleItem/ScheduleItem';


@injectable()
export class ScheduleItemsStore {
  constructor() {
    // eslint-disable-next-line no-console
    console.log('constructor ScheduleItemsStore');

    // засунем что-нить в коллекцию для теста
    const exp = new ScheduleItem();
    exp.id = 1;
    exp.subjectId = 1;
    exp.academicYearId = 1;
    this.collection.set(1, exp);
  }

  @observable private collection: Map<number, ScheduleItem> = new Map();

  getById(id: number) {
    const schedule = this.collection.get(id);
    if (!schedule) {
      // eslint-disable-next-line no-console
      console.error(`Поптка взять несуществующий id. Нет id: ${id} в сторе ScheduleItemsStore`);
      return null;
    }
    return schedule;
  }
}
