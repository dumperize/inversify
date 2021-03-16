import { container, commonObject } from './links';


type TY = typeof commonObject;
type RootStoreType = { [P in keyof TY]: InstanceType<TY[P]> };
const target = {} as RootStoreType;

export const RootStore = new Proxy(target, {
  get(obj, prop) {
    return container.get(commonObject[prop]);
  },
});


export default RootStore;
