import { observable, action } from 'mobx';


export class Subject {
  @observable id: number;
  @observable name: string;


  @action setName(value: string) {
    this.name = value;
  }
}
