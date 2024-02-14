# @mild-ts/npm-typescript-boilerplate

## 1.0.0

### Major Changes

- cfd28b1: Release first stable version

  ## Breaking Changes

  - Type changed from `ServerOptions` to `DataViewerOptions`
  - Moved `logger?: LoggerOptions;` from `DataViewerOptions` to `StartOptions` with new option name `loggerOption?: LoggerOptions;` for `start` method
  - Used `logger?: Logger;` in `DataViewerOptions` for custom logger
  - Moved `port` from `DataViewerOptions` to `start` method (with type `StartOptions`)
    `DataViewerOptions` is now dataViewer.addOption
  - `TableComponent` interface `data` property is allow `(Record<string, unknown> | object)[];` type.

  ## New Features

  ## **Create Data Container**

  Sometimes, you may want to create a data container and add data to it later.

  ```ts
  export function myReport() {
    const container = new Container();
    container.addHeader('My Header');
    return container.get();
  }

  dataViewer.addContainer(myReport());
  dataViewer.start();
  ```

  ## Support Custom Server

  You can use the `registerMiddleware` method to integrate with your existing server.

  ```ts
  const getUsers = async () => (await fetch('https://jsonplaceholder.typicode.com/users')).json();

  const dataViewer = new DataViewer({
    path: '/viewer',
  });

  dataViewer.addHeader('User Table');
  dataViewer.addTable(await getUsers());

  const app = express();
  dataViewer.registerMiddleware(app);

  app.listen(3000, async () => console.log(`Already servered on http://localhost:3000/viewer`));
  ```

  ## Support Custom Logger

  You can use the `logger` option to integrate with your existing log,
  this example uses [pino](https://github.com/pinojs/pino) log

  ```ts
  import pino from 'pino';
  const logger = pino();

  const stringLogger = {
    log: (message: string) => logger.info(message),
    debug: (message: string) => logger.debug(message),
    info: (message: string) => logger.info(message),
    warn: (message: string) => logger.warn(message),
    error: (message: string) => logger.error(message),
  };

  const dataViewer = new DataViewer({
    path: '/viewer',
    logger: stringLogger,
  }).start();
  ```

## 0.0.2

### Patch Changes

- 1003c11: Setup export default

## 0.0.1

### Patch Changes

- 6d99ec6: Init boilerplate
