# comebackhome

Add an unintrusive banner with photos of missing people to your site's 404 pages in the off-chance that someone who visits your site might recognize them.

## Usage
Simply include the script into your `HTTP 404 - Page Not Found` page:
```html
<script src="//comebackhome.org/js/comebackhome.bundle.min.js"></script>
```
You could also choose to include a local version of the script:
```html
<script src="dist/comebackhome.bundle.min.js"></script>
```

## How can I contribute?
Distribution is crucial for this plugin. The more people searching for missing people, the better the chances that someone will be found.

The most effective way to contribute to this effort is to include this plugin in your site, and the sites of your friends and employer.

You can also contribute by providing access to databases of missing people. We will be open-sourcing the API to push to our missing persons database soon, but until then, you can email contact@comebackhome.org with details.

Finally, you can also help by improving the plugin. In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality

## Development

### Tools
We use the following tools for development:

- [NodeJS](http://nodejs.org/download/) required to run gulp.
- [gulp](http://gulpjs.com) for task management and build process.
- [stylus](http://gulpjs.com) for writing css

### Getting started

1. Install [NodeJS](http://nodejs.org/)
2. Install gulp globally:

    ```sh
    $ npm install --global gulp
    ```

3. Run gulp to build the source files. You will find the output under `dist`

    ```sh
    $ gulp
    ```

The plugin's code is contained in `src/comebackhome.js` and the styles are contained in `src/comebackhome.styl`. The templates of how the results are displayed are captured in the files in the `src/templates` directory.

### Internationalization

The translatable source strings and their translations are hosted on [Transifex](https://www.transifex.com/projects/p/comebackhome/).

To build an internationalized version of comebackhome, run the following command. The language version will be written to `dist/<language_code>`

```sh
$ gulp build --language zh_CN
```

## License
Copyright (c) 2015 Bipin Suresh. Licensed under the GPL license.
