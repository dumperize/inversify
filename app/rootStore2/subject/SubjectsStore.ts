import { injectable } from 'inversify';
import { observable } from 'mobx';

import { Subject } from 'rootStore2/subject';


@injectable()
export class SubjectsStore {
  constructor() {
    // eslint-disable-next-line no-console
    console.log('constructor SubjectsStore');

    // засунем что-нить в коллекцию для теста
    const exp = new Subject();
    exp.id = 1;
    exp.name = 'Алгебра';
    this.collection.set(1, exp);
  }

  @observable private collection: Map<number, Subject> = new Map();

  getById(id: number) {
    const subject = this.collection.get(id);
    if (!subject) {
      // eslint-disable-next-line no-console
      console.error(`Поптка взять несуществующий id. Нет id: ${id} в сторе SubjectsStore`);
      return null;
    }
    return subject;
  }
}
