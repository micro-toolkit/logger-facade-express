# Logger Facade Express

[![Build Status](https://travis-ci.org/micro-toolkit/logger-facade-express.svg?branch=master)](https://travis-ci.org/micro-toolkit/logger-facade-express)

HTTP request logger facade middleware for express inspired in [expressjs/morgan](https://github.com/expressjs/morgan) package.

# How to use it

Install it:

```
npm install logger-facade-nodejs
npm install logger-facade-express
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Bump versioning

We use [grunt bump package](https://www.npmjs.org/package/grunt-bump) to control package versioning.

Bump Patch version

    $ grunt bump

Bump Minor version

    $ grunt bump:minor

Bump Major version

    $ grunt bump:major

## Running Specs

    $ npm test

## Coverage Report

We aim for 100% coverage and we hope it keeps that way! :)

Check the report after running npm test.

    $ open ./coverage/lcov-report/index.html
