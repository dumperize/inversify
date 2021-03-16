import { observable } from 'mobx';
import { injectable } from 'inversify';

import { AcademicYear } from 'rootStore2/academicYears/AcademicYear';


@injectable()
export class AcademicYearsStore {
  constructor() {
    // eslint-disable-next-line no-console
    console.log('constructor AcademicYearsStore');
    // засунем что-нить в коллекцию для теста
    const exp = new AcademicYear();
    exp.id = 1;
    exp.name = 'first';
    this.collection.set(1, exp);
  }

  @observable private collection: Map<number, AcademicYear> = new Map();

  getById(id: number) {
    const year = this.collection.get(id);
    if (!year) {
      // eslint-disable-next-line no-console
      console.error(`Поптка взять несуществующий id. Нет id: ${id} в сторе AcademicYearsStore`);
      return null;
    }
    return year;
  }
}
