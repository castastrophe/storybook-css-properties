import React, { useEffect, useState } from "react";
import { ArgsTable } from "@storybook/components";
import { useDebounce } from "../use-debounce";
import type {
  ICssCustomPropertiesParams,
  IItem,
  PanelContentProps,
} from "../params";
import { getIframeRoot, tableArgsBuilder } from "../utils";

export const PanelContent: React.FC<PanelContentProps> = ({
  baseProperties,
  propsConfig,
  matchCategory,
  filterProps,
  hiddenProps,
}) => {
  const properties = [...baseProperties];
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const debouncedValue = useDebounce<string>(value, 100);

  const changeHandler = (value: string, key: string) => {
    properties.map((obj) => {
      if (obj.key === key) {
        obj.value = value;
      }

      return obj;
    });

    setValue(value);
    setKey(key);
  };

  useEffect(() => {
    if (value === "") return;

    const root = getIframeRoot();
    root.style.setProperty(key, value);

    changeHandler("", "");
  }, [debouncedValue]);

  let tableArgs = tableArgsBuilder(
    baseProperties,
    propsConfig,
    filterProps,
    hiddenProps,
    matchCategory
  );

  const resetArgs = () => {
    window.location.reload();
  };

  return (
    <ArgsTable
      inAddonPanel
      resetArgs={() => resetArgs()}
      rows={tableArgs}
      updateArgs={(a) => {
        Object.keys(a).forEach((key) => changeHandler(a[key], key));
      }}
    />
  );
};
