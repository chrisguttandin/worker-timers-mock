const { env } = require('process');

module.exports = function (config) {

    config.set({

        basePath: '../../',

        concurrency: 2,

        files: [
            'test/unit/**/*.js'
        ],

        frameworks: [
            'mocha',
            'sinon-chai'
        ],

        mime: {
            'text/x-typescript': [ 'ts', 'tsx' ]
        },

        preprocessors: {
            'src/**/*.ts': 'webpack',
            'test/unit/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [ {
                    test: /\.ts?$/,
                    use: {
                        loader: 'ts-loader'
                    }
                } ]
            },
            resolve: {
                extensions: [ '.js', '.ts' ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        }

    });

    if (env.TRAVIS) {

        config.set({

            browsers: [
                // 'ChromeCanarySauceLabs',
                'ChromeSauceLabs',
                // 'FirefoxDeveloperSauceLabs',
                'FirefoxSauceLabs'
            ],

            captureTimeout: 120000,

            customLaunchers: {
                ChromeCanarySauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    platform: 'OS X 10.11',
                    version: 'dev'
                },
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    platform: 'OS X 10.11'
                },
                FirefoxDeveloperSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'OS X 10.11',
                    version: 'dev'
                },
                FirefoxSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'OS X 10.11'
                }
            },

            tunnelIdentifier: env.TRAVIS_JOB_NUMBER

        });

    } else {

        config.set({

            browsers: [
                'ChromeHeadless',
                'ChromeCanaryHeadless',
                'FirefoxHeadless',
                'FirefoxDeveloperHeadless'
            ]

        });

    }

};
