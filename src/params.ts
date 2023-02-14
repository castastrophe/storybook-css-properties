import { Control, Options } from "@storybook/components";

export interface IItem {
  key: string,
  name: string,
  value: string,
  type: string
}

interface ParamProp {
  control: Control,
  options: Options,
  description: string
  category: string
}

export interface ICssCustomPropertiesParams {
  root?: string;
  props?: Record<string, ParamProp>;
  filterProps?: (string | RegExp)[];
  hiddenProps?: (string | RegExp)[];
  matchCategory?: Record<string, RegExp>;
}

export interface PanelProps {
  active: boolean;
}

export interface PanelContentProps {
  baseProperties: IItem[];
  propsConfig: ICssCustomPropertiesParams["props"];
  matchCategory: ICssCustomPropertiesParams["matchCategory"];
  filterProps: ICssCustomPropertiesParams["filterProps"];
  hiddenProps: ICssCustomPropertiesParams["hiddenProps"];
}
