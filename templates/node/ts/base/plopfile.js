export default function (/** @type {import('plop').NodePlopAPI} */ plop) {
  plop.setGenerator('feature', {
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your feature/resource name?',
      },
      {
        type: 'checkbox',
        message: 'What files do you want to generate?',
        name: 'fileToGenerate',
        choices: [
          {
            name: '.router.ts',
            value: 'router',
            checked: true,
          },
          {
            name: '.service.ts',
            value: 'service',
            checked: true,
          },
          {
            name: '.controller.ts',
            value: 'controller',
            checked: true,
          },
        ],
      },
    ],
    actions: (answers) => {
      const actions = [
        {
          type: 'addMany',
          destination: 'src/features/{{dashCase name}}',
          base: 'plop-templates/feature-templates',
          templateFiles: `plop-templates/feature-templates/*.(${answers.fileToGenerate.join(
            '|'
          )}).ts.hbs`,
        },
      ];

      if (answers.fileToGenerate.includes('router'))
        actions.push(
          {
            type: 'modify',
            path: 'src/app-router.ts',
            pattern: /(\/\/ \* inject feature\/resource router imports below)/g,
            template:
              "$1\nimport { {{camelCase name}}Router } from './features/{{dashCase name}}/{{dashCase name}}.router';",
          },
          {
            type: 'modify',
            path: 'src/app-router.ts',
            pattern: /(\/\/ \* inject feature\/resource routers below)/g,
            template:
              "$1\nrouter.use('{{dashCase name}}',{{camelCase name}}Router);",
          }
        );

      return actions;
    },
  });
}
