target:
Application that serves the library in hot reload. This would speed up debugging and testing libraries

works: 
- The application works and imports the created validation messages library (first run `npm run bootstrap` )
- the application imports the library in files: validation-messages-page.presenter.ts, validation-message-page.module.ts.
  These are where you can test importing library


I tried to solve problem: 
1. run symlinks after run rebuild libki on watch mode(ng-packagr --watch) and at the same time, I was serving app which that would be refreshed
   result: the application cannot see the rebuilt library
2. run the application in 2 modes: 
   a) dev mode - the source code of the library would be imported by the application to reload in realtime
   b) static build mode  -> would be used to test build library before release
   result:  problem with importing source code library from non-root directory. there is an injection context error

