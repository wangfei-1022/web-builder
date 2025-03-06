import BooleanView from './BooleanView.vue';
import JsonView from './JsonView.vue';
import NumberView from './NumberView.vue';
import PercentView from './PercentView.vue';

export {
  BooleanView,
  JsonView,
  NumberView,
  PercentView,
}

export type BooleanViewInstance = InstanceType<typeof BooleanView>;
export type JsonViewInstance = InstanceType<typeof JsonView>;
export type NumberViewInstance = InstanceType<typeof NumberView>;
export type PercentViewInstance = InstanceType<typeof PercentView>;