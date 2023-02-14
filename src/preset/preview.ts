import { makeDecorator, useChannel } from "@storybook/addons";
import { EVENTS } from "../constants";
import type { ICssCustomPropertiesParams } from "../params";

import { getAllCSSVariables } from "../get-all-css-variables";

export const decorators: any[] = [
  makeDecorator({
    name: "withCssProperties",
    parameterName: "cssCustomProperties",
    wrapper: (storyFn, context, { parameters }) => {
      const emit = useChannel({});

      const findRootNode = () => {
        const rootSelector = parameters.root || "#root";
        const root = document.querySelector(rootSelector);
        if (!root) setTimeout(findRootNode, 2000);
        return root.documentElement || root;
      };

      const root = findRootNode();
      if (root) {
        emit(EVENTS.CODE_UPDATE, { root, options: parameters });
        const variables = getAllCSSVariables(root, parameters);
        console.log(variables);
      }

      return storyFn(context);
    }
  }),
]
