import { ContainerModule, interfaces } from 'inversify';

import { AcademicYearsStore } from 'rootStore2/academicYears';
import { ScheduleItemsStore } from 'rootStore2/sheduleItem';
import { SubjectsStore } from 'rootStore2/subject';

import { container } from './fit';

// можно работать с интерфейсами сторов, но в журнале вроде не особо нужно это

// глобальные сторы
export const globalObject = {
  academicYearsStore: AcademicYearsStore,
} as const;

// локальные сторы
export const localObject = {
  // academicYearsStore: AcademicYearsStore,
  scheduleItemsStore: ScheduleItemsStore,
  subjectsStore: SubjectsStore,
} as const;

// сторы все вместе
export const commonObject = {
  ...globalObject,
  ...localObject,
} as const;

// биндинг глобальных
const globals = new ContainerModule((bind: interfaces.Bind) => {
  // @ts-ignore
  Object.values(globalObject).forEach(type => bind(type).toSelf().inSingletonScope());
});

// биндинг локальных
const locals = new ContainerModule((bind: interfaces.Bind) => {
  // @ts-ignore
  Object.values(localObject).forEach(type => bind(type).toSelf().inSingletonScope());
});

// загрузим все в контейнерок
container.load(globals, locals);

// метод для вычистки локальных, можно запустить в роутере на смене страницы
// глобальные остаются
export const reloadLocal = () => {
  container.unload(locals);
  container.load(locals);
};

export { container };
