import {Async as PrimateID} from './lib/primate-id';

(new PrimateID()).Generate('XX').then(x => console.log(x));
