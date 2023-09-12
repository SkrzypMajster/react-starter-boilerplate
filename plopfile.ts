import { NodePlopAPI, PlopGeneratorConfig } from '@crutchcorn/plop';
import promptDirectory from 'inquirer-directory';
import { lstatSync, readdirSync } from 'fs';
import path from 'path';

declare module 'inquirer-directory' {
  type test = unknown;
}

/// CONSTANTS AND UTILS ///

const componentTypes = {
  REACT_APP_COMPONENT: 'React app component',
  REACT_APP_CONTAINER_COMPONENT: 'React app component with container',
  REACT_UI_COMPONENT: 'React UI component',
  CUSTOM_HOOK: 'Custom hook',
  API_ACTIONS: 'API actions collection',
  API_QUERY: 'API query',
  API_MUTATION: 'API mutation',
  REACT_CONTEXT: 'React Context',
}

const isDirectory = (source: string): boolean => lstatSync(source).isDirectory();

const getDirectories = (source: string): string[] =>
  readdirSync(source)
    .map((name) => path.join(source, name))
    .filter(isDirectory);

const NAME_REGEX = /[^\/]+$/;

const apiActionCollections = getDirectories(`./src/api/actions`)
  .map(collection => {
    const result = NAME_REGEX.exec(collection);

    if (!result) {
      return '';
    }

    return result[0].trimStart().trimEnd();
  });

const getPlaceholderPattern = (pattern: string) => new RegExp(`(\/\/ ${pattern})`, 's');

/// GENERATOR FUNCTIONS ///

const reactAppComponentGenerator = (): PlopGeneratorConfig => ({
  description: componentTypes.REACT_APP_COMPONENT,
  prompts: [
    {
      type: 'directory',
      name: 'directory',
      message: 'select directory',
      basePath: './src/app',
    } as any,
    {
      type: 'input',
      name: 'name',
      message: 'component name',
    },
  ],
  actions: [
    {
      type: 'add',
      path: `src/app/{{directory}}/{{camelCase name}}/{{pascalCase name}}.tsx`,
      templateFile: 'plop-templates/component/Component.hbs',
    },
    {
      type: 'add',
      path: `src/app/{{directory}}/{{camelCase name}}/{{pascalCase name}}.test.tsx`,
      templateFile: 'plop-templates/component/Component.test.hbs',
    },
    {
      type: 'add',
      path: `src/app/{{directory}}/{{camelCase name}}/{{pascalCase name}}.types.ts`,
      templateFile: 'plop-templates/component/Component.types.hbs',
    },
  ],
});

const reactAppContainerComponentGenerator = (): PlopGeneratorConfig => ({
  description: componentTypes.REACT_APP_CONTAINER_COMPONENT,
  prompts: [
    {
      type: 'directory',
      name: 'directory',
      message: 'select directory',
      basePath: './src/app',
    } as any,
    {
      type: 'input',
      name: 'name',
      message: 'component name',
    },
  ],
  actions: [
    {
      type: 'add',
      path: `src/app/{{directory}}/{{camelCase name}}/{{pascalCase name}}.tsx`,
      templateFile: 'plop-templates/component/Component.hbs',
    },
    {
      type: 'add',
      path: `src/app/{{directory}}/{{camelCase name}}/{{pascalCase name}}.test.tsx`,
      templateFile: 'plop-templates/component/Component.test.hbs',
    },
    {
      type: 'add',
      path: `src/app/{{directory}}/{{camelCase name}}/{{pascalCase name}}Container.tsx`,
      templateFile: 'plop-templates/component/Container.hbs',
    },
    {
      type: 'add',
      path: `src/app/{{directory}}/{{camelCase name}}/{{pascalCase name}}.types.ts`,
      templateFile: 'plop-templates/component/ContainerComponent.types.hbs',
    },
  ],
});

const reactUiComponentGenerator = (): PlopGeneratorConfig => ({
  description: componentTypes.REACT_UI_COMPONENT,
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'component name',
    },
  ],
  actions: [
    {
      type: 'add',
      path: `src/ui/{{camelCase name}}/{{pascalCase name}}.tsx`,
      templateFile: 'plop-templates/component/Component.hbs',
    },
    {
      type: 'add',
      path: `src/ui/{{camelCase name}}/{{pascalCase name}}.test.tsx`,
      templateFile: 'plop-templates/component/Component.test.hbs',
    },
    {
      type: 'add',
      path: `src/ui/{{camelCase name}}/{{pascalCase name}}.types.ts`,
      templateFile: 'plop-templates/component/Component.types.hbs',
    },
    {
      type: 'modify',
      path: 'src/ui/index.ts',
      pattern: 'export',
      templateFile: 'plop-templates/component/Component.index.hbs',
    },
  ]
});

const customHookGenerator = (): PlopGeneratorConfig => ({
  description: componentTypes.CUSTOM_HOOK,
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'hook name',
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'src/hooks/{{camelCase name}}/{{camelCase name}}.tsx',
      templateFile: 'plop-templates/hook/hook.hbs',
    },
    {
      type: 'add',
      path: 'src/hooks/{{camelCase name}}/{{camelCase name}}.test.tsx',
      templateFile: 'plop-templates/hook/hook.test.hbs',
    },
    {
      type: 'modify',
      path: 'src/hooks/index.ts',
      pattern: 'export',
      templateFile: 'plop-templates/hook/hook.index.hbs',
    },
  ],
});

const apiActionsGenerator = (): PlopGeneratorConfig => ({
  description: componentTypes.API_ACTIONS,
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'actions collection name',
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'src/api/actions/{{camelCase name}}/{{camelCase name}}.mutations.ts',
      templateFile: 'plop-templates/apiActions/apiActions.mutations.hbs',
    },
    {
      type: 'add',
      path: 'src/api/actions/{{camelCase name}}/{{camelCase name}}.queries.ts',
      templateFile: 'plop-templates/apiActions/apiActions.queries.hbs',
    },
    {
      type: 'add',
      path: 'src/api/actions/{{camelCase name}}/{{camelCase name}}.types.ts',
      templateFile: 'plop-templates/apiActions/apiActions.types.hbs',
    },
    {
      type: 'modify',
      path: 'src/api/actions/index.ts',
      pattern: getPlaceholderPattern('API_COLLECTION_IMPORTS'),
      template:
        'import { {{camelCase name}}Mutations } from \'./{{camelCase name}}/{{camelCase name}}.mutations\';\nimport { {{camelCase name}}Queries } from \'./{{camelCase name}}/{{camelCase name}}.queries\';\n$1',
    },
    {
      type: 'modify',
      path: 'src/api/actions/index.ts',
      pattern: getPlaceholderPattern('API_COLLECTION_QUERIES'),
      template: '...{{camelCase name}}Queries,\n  $1',
    },
    {
      type: 'modify',
      path: 'src/api/actions/index.ts',
      pattern: getPlaceholderPattern('API_COLLECTION_MUTATIONS'),
      template: '...{{camelCase name}}Mutations,\n  $1',
    },
  ],
});

const apiQueryGenerator = (toKebabCase: Function): PlopGeneratorConfig => ({
  description: componentTypes.API_QUERY,
  prompts: [
    {
      type: "list",
      name: "collection",
      message: "API actions collection name?",
      default: apiActionCollections[0],
      choices: apiActionCollections.map((collection) => ({ name: collection, value: collection })),
    },
    {
      type: 'input',
      name: 'name',
      message: 'API query action name?',
    },
    {
      type: 'input',
      name: 'path',
      message: 'API query action path?',
      default: (answers: { collection: string; name: string }) => `/${answers.collection}/${toKebabCase(answers.name)}`,
    },
  ],
  actions: [
    {
      type: 'modify',
      path: 'src/api/actions/{{collection}}/{{collection}}.types.ts',
      pattern: getPlaceholderPattern('API_ACTION_TYPES'),
      templateFile: 'plop-templates/apiQuery/apiQuery.types.hbs',
    },
    {
      type: 'modify',
      path: 'src/api/actions/{{collection}}/{{collection}}.queries.ts',
      pattern: getPlaceholderPattern('QUERY_TYPE_IMPORTS'),
      template: '{{pascalCase name}}Payload,\n  {{pascalCase name}}Response,\n  $1',
    },
    {
      type: 'modify',
      path: 'src/api/actions/{{collection}}/{{collection}}.queries.ts',
      pattern: getPlaceholderPattern('QUERY_FUNCTIONS_SETUP'),
      templateFile: 'plop-templates/apiQuery/apiQuery.hbs',
    }
  ],
});

const apiMutationGenerator = (toKebabCase: Function): PlopGeneratorConfig => ({
  description: componentTypes.API_MUTATION,
  prompts: [
    {
      type: "list",
      name: "collection",
      message: "API actions collection name?",
      default: apiActionCollections[0],
      choices: apiActionCollections.map((collection) => ({ name: collection, value: collection })),
    },
    {
      type: 'input',
      name: 'name',
      message: 'API query action name?',
    },
    {
      type: 'input',
      name: 'path',
      message: 'API query action path?',
      default: (answers: { collection: string; name: string }) => `/${answers.collection}/${toKebabCase(answers.name)}`,
    },
    {
      type: "list",
      name: "method",
      message: "Mutation action method?",
      default: "post",
      choices: [
        { name: "post", value: "post" },
        { name: "delete", value: "delete" },
        { name: "patch", value: "patch" },
        { name: "put", value: "put" },
      ],
    }
  ],
  actions: [
    {
      type: 'modify',
      path: 'src/api/actions/{{collection}}/{{collection}}.types.ts',
      pattern: getPlaceholderPattern('API_ACTION_TYPES'),
      templateFile: 'plop-templates/apiMutation/apiMutation.types.hbs',
    },
    {
      type: 'modify',
      path: 'src/api/actions/{{collection}}/{{collection}}.mutations.ts',
      pattern: getPlaceholderPattern('MUTATION_TYPE_IMPORTS'),
      template: '{{pascalCase name}}Payload,\n  {{pascalCase name}}Response,\n  $1',
    },
    {
      type: 'modify',
      path: 'src/api/actions/{{collection}}/{{collection}}.mutations.ts',
      pattern: getPlaceholderPattern('MUTATION_FUNCTIONS_SETUP'),
      templateFile: 'plop-templates/apiMutation/apiMutation.hbs',
    }
  ],
});

const reactContextGenerator = (): PlopGeneratorConfig => ({
  description: componentTypes.REACT_CONTEXT,
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'context name',
    }
  ],
  actions: [
    {
      type: 'add',
      path: 'src/context/{{camelCase name}}/{{camelCase name}}Context/{{pascalCase name}}Context.ts',
      templateFile: 'plop-templates/context/Context.hbs',
    },
    {
      type: 'add',
      path: 'src/context/{{camelCase name}}/{{camelCase name}}Context/{{pascalCase name}}Context.types.ts',
      templateFile: 'plop-templates/context/Context.types.hbs',
    },
    {
      type: 'add',
      path: 'src/context/{{camelCase name}}/{{camelCase name}}Context/{{pascalCase name}}Context.test.tsx',
      templateFile: 'plop-templates/context/Context.test.hbs',
    },
    {
      type: 'add',
      path: 'src/context/{{camelCase name}}/{{camelCase name}}ContextController/{{pascalCase name}}ContextController.tsx',
      templateFile: 'plop-templates/context/ContextController.hbs',
    },
    {
      type: 'add',
      path: 'src/context/{{camelCase name}}/{{camelCase name}}ContextController/{{pascalCase name}}ContextController.types.ts',
      templateFile: 'plop-templates/context/ContextController.types.hbs',
    },
    {
      type: 'add',
      path: 'src/hooks/use{{pascalCase name}}/use{{pascalCase name}}.ts',
      templateFile: 'plop-templates/context/useContext.hbs',
    },
    {
      type: 'add',
      path: 'src/hooks/use{{pascalCase name}}/use{{pascalCase name}}.test.tsx',
      templateFile: 'plop-templates/context/useContext.test.hbs',
    },
  ],
});

/// CONFIG ///

export default function (plop: NodePlopAPI) {
  const toKebabCase = plop.getHelper('kebabCase');

  plop.setPrompt('directory', promptDirectory);
  plop.setGenerator(componentTypes.REACT_APP_COMPONENT, reactAppComponentGenerator());
  plop.setGenerator(componentTypes.REACT_APP_CONTAINER_COMPONENT, reactAppContainerComponentGenerator());
  plop.setGenerator(componentTypes.REACT_UI_COMPONENT, reactUiComponentGenerator());
  plop.setGenerator(componentTypes.CUSTOM_HOOK, customHookGenerator());
  plop.setGenerator(componentTypes.API_ACTIONS, apiActionsGenerator());
  plop.setGenerator(componentTypes.API_QUERY, apiQueryGenerator(toKebabCase));
  plop.setGenerator(componentTypes.API_MUTATION, apiMutationGenerator(toKebabCase));
  plop.setGenerator(componentTypes.REACT_CONTEXT, reactContextGenerator());
};
