import { observable, action } from 'mobx';


export class AcademicYear {
  @observable id: number;
  @observable name: string;

  @action setName(value: string) {
    this.name = value;
  }
}
