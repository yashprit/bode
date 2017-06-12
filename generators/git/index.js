'use strict';
const Generator = require('yeoman-generator');
const originUrl = require('git-remote-origin-url');

module.exports = Generator.extend({
  constructor: function () {
    Generator.apply(this, arguments);

    this.option('generateInto', {
      type: String,
      required: false,
      defaults: '',
      desc: 'Relocate the location of the generated files.'
    });

    this.option('name', {
      type: String,
      required: true,
      desc: 'Module name'
    });

    this.option('github-account', {
      type: String,
      required: true,
      desc: 'GitHub username or organization'
    });
  },

  initializing: function () {
    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath(this.options.generateInto, '.gitattributes')
    );

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath(this.options.generateInto, '.gitignore')
    );

    return originUrl(this.destinationPath(this.options.generateInto))
      .then(function (url) {
        this.originUrl = url;
      }.bind(this), function () {
        this.originUrl = '';
      }.bind(this));
  },

  writing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath(this.options.generateInto, 'package.json'), {});

    let repository = '';
    if (this.originUrl) {
      repository = this.originUrl;
    } else {
      repository = this.options.githubAccount + '/' + this.options.name;
    }

    this.pkg.repository = this.pkg.repository || repository;

    this.fs.writeJSON(this.destinationPath(this.options.generateInto, 'package.json'), this.pkg);
  }
});
