import React, { useState, useMemo } from "react";

import { AddonPanel } from "@storybook/components";
import { useAddonState, useChannel, useParameter } from "@storybook/api";

import { PanelContent } from "./components/PanelContent";
import { getAllCSSVariables } from "./get-all-css-variables";
import { ADDON_ID, EVENTS, PARAM_KEY } from "./constants";
import { useLocalStorage } from "./use-local-storage";

import type { ICssCustomPropertiesParams, PanelProps } from "./params";

export const Panel: React.FC<PanelProps> = (props) => {
  const storage = useLocalStorage();
  const [{ root }, setState] = useAddonState(ADDON_ID, {
    root: null,
    options: {},
  });
  const parameters: ICssCustomPropertiesParams = useParameter(PARAM_KEY, {});
  const variables = useMemo(
    () => getAllCSSVariables(root, parameters),
    [root, parameters]
  );

  useChannel({
    [EVENTS.CODE_UPDATE]: ({ root }) =>
      setState((state) => ({ ...state, root })),
  });

  storage.setLocalStorage(ADDON_ID, {
    initialValues: variables,
  });

  return (
    <AddonPanel {...props}>
      <PanelContent
        baseProperties={variables}
        propsConfig={parameters?.props ?? {}}
        matchCategory={parameters?.matchCategory ?? {}}
        filterProps={parameters?.filterProps ?? []}
        hiddenProps={parameters?.hiddenProps ?? []}
      />
    </AddonPanel>
  );
};
