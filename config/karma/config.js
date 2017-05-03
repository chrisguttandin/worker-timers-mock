module.exports = function (config) {

    config.set({

        files: [
            '../../test/unit/**/*.js'
        ],

        frameworks: [
            'browserify',
            'mocha',
            'sinon-chai'
        ],

        preprocessors: {
            '../../test/unit/**/*.js': 'browserify'
        }

    });

    if (process.env.TRAVIS) {

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

            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER

        });

    } else {

        config.set({

            browsers: [
                'Chrome',
                'ChromeCanary',
                'Firefox',
                'FirefoxDeveloper'
            ]

        });

    }

};
