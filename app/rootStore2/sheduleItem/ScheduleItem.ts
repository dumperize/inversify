import { computed, observable } from 'mobx';

import { lazyInject } from 'rootStore2/fit';
import { AcademicYearsStore } from 'rootStore2/academicYears';
import { SubjectsStore } from 'rootStore2/subject';


export class ScheduleItem {
  @lazyInject(AcademicYearsStore) private readonly academicYearsStore: AcademicYearsStore;
  @lazyInject(SubjectsStore) private readonly subjectsStore: SubjectsStore;

  @observable id: number;
  @observable academicYearId: number;
  @observable subjectId: number;

  @computed get academicYear() {
    return this.academicYearsStore.getById(this.academicYearId);
  }

  @computed get subject() {
    return this.subjectsStore.getById(this.subjectId);
  }
}
