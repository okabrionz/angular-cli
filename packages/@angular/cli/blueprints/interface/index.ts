import {getAppFromConfig} from '../../utilities/app-utils';

const stringUtils = require('ember-cli-string-utils');
const dynamicPathParser = require('../../utilities/dynamic-path-parser');
const Blueprint = require('../../ember-cli/lib/models/blueprint');

export default Blueprint.extend({
  description: '',

  anonymousOptions: [
    '<interface-type>'
  ],

  availableOptions: [
    {
      name: 'app',
      type: String,
      aliases: ['a'],
      description: 'Specifies app name to use.'
    }
  ],

  normalizeEntityName: function (entityName: string) {
    const appConfig = getAppFromConfig(this.project.ngConfig.apps, this.options.app);
    const parsedPath = dynamicPathParser(this.project, entityName, appConfig);

    this.dynamicPath = parsedPath;
    return parsedPath.name;
  },

  locals: function (options: any) {
    const interfaceType = options.args[2];
    this.fileName = stringUtils.dasherize(options.entity.name);
    if (interfaceType) {
      this.fileName += '.' + interfaceType;
    }
    const prefix = this.project.ngConfigObj.get('defaults.interface.prefix');
    return {
      dynamicPath: this.dynamicPath.dir,
      flat: options.flat,
      fileName: this.fileName,
      prefix: prefix
    };
  },

  fileMapTokens: function () {
    // Return custom template variables here.
    return {
      __path__: () => {
        this.generatePath = this.dynamicPath.dir;
        return this.generatePath;
      },
      __name__: () => {
        return this.fileName;
      }
    };
  }
});
