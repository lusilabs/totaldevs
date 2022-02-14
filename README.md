# README

## Architecture

The project is split between front (what the user sees) and back (functions and business logic).
The backend is only the `functions/` directory, everything else is frontend.

Uses [Firebase](https://console.firebase.google.com/u/0/project/fire-b5966/overview) for auth, database, storage, serverless as well as hosting and deploying.

### Frontend
- The frontend is built with [NextJS](https://nextjs.org/docs/getting-started).
- Styles with [TailwindCSS](https://tailwindcss.com/docs/container).
- Prebuilt components with utilities [SemanticUIReact](https://react.semantic-ui.com/)

### Backend
- Serverless using [Cloud Functions](https://firebase.google.com/docs/functions)

## Quickstart
### Clone repo and install packages for front and back
```
git clone https://github.com/lobotomisador/totaldevs.git
cd totaldevs
npm i
cd functions
npm i
```

#### Firebase
```
npm i -g add firebase firebase-tools
```

### Install these first
#### Java JDK (for emulators!)
If not installed you will get the following error:
```
The operation couldn’t be completed. Unable to locate a Java Runtime.
Please visit http://www.java.com for information on installing Java.
```

Download at [https://www.oracle.com/java/technologies/javase-jdk15-downloads.html]


## Set up `stripe-cli` locally

```
brew install stripe/stripe-cli/stripe
brew upgrade stripe/stripe-cli/stripe
stripe login
```

Send the code to the main devs to get your test account.


Start the local emulator for webhooks.

```
npm run stripe
```

The general signature is

```
stripe listen --forward-to localhost:5001/{projectID}/{region}/{exportsName}-{functionName}
```

Trigger and resend events

`stripe trigger {eventType}`
`stripe events resent {eventID}`

View examples:
`stripe samples list`

## Set up firebase emulators

```
firebase login firebase init
```

Select project (totaldevs-25387)

install all tools.
DO NOT override existing .json or .gitignores
don't use eslint
install all dependencies needed

do not override .html
install and download ALL emulators with default ports

`firebase init emulators`

Choose ALL tools.

### Start
```
npm run all
```

Or selectively
```
npm run dev
npm run emulators
npm run stripe
```

### Setting secret keys and env variables

To view config and run locally
`firebase functions:config:get > functions/.runtimeconfig.json`

To set keys locally
`firebase functions:config:set stripe.secret_key_local="sk_test_.."`

### Export emulators
To save a checkpoint on the current state of the emulators run 
`firebase emulators:export ./emulators`

The import code should just load it next time you start


## Help
If stuck ask someone for help and contribute to this README with the solution if it is a recurring problem.

#### Services not starting
```
⚠  firestore: Port 5004 is not open on localhost, could not start Firestore Emulator.
⚠  firestore: To select a different host/port, specify that host/port in a firebase.json config file:
      {
        // ...
        "emulators": {
          "firestore": {
            "host": "HOST",
            "port": "PORT"
          }
        }
      }
i  emulators: Shutting down emulators.

Error: Could not start Firestore Emulator, port taken.
```
Quickfix: hard restart emulators with `npm run restart`
Long explanation:

Check processes running at the reserved ports

For emulators:
`lsof -i | grep java`

For all processes an all ports
`lsof -i | grep LISTEN`

Then kill the service with pid say 56122 as (second number from the right, after the name of the process i.e Python Node Java)
`kill {pid}`
`kill 56122`



#### `CORS error`
```
[Error] Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin.
[Error] Fetch API cannot load http://localhost:5001/fire-b5966/us-central1/helloWorld due to access control checks.
[Error] Failed to load resource: Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin. (helloWorld, line 0)
[Error] Unhandled Promise Rejection: Error: internal
	(anonymous function)
	promiseReactionJob
```
this means you are calling `helloWorld` which is a `onRequest` function that creates an endpoint,
which is accesible through a POST!, change the type to an `onCall` to be able to call it!
or you are not calling the correct 'endpoint', if you are calling a function that's not in the main `serverless.js` module you need to prefix it with the module name i.e.

```
exports.users = require('./users.js')
exports.handleUserSignIn = functions.https.onCall(async (data, context) => {
  logger.info(data, context)
  return 'success'
})
const handleUserSignInFrontend = firebase.functions().httpsCallable('users-handleUserSignIn')
```

### `code "auth/network-request-failed"`
```code: "auth/network-request-failed"
message: "A network error (such as timeout, interrupted connection or unreachable host) has occurred."
[[Prototype]]: Error
```

this happened when the frontend could not connect to the emulators because they were running on different ports, make sure they are running on the ports specified in `index.js`!


#### `FirebaseError: No matching allow statements`
means the collection/doc is not accessible, check firestore rules.

setup global read write rules for firestore to work with arbitrary collections to

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read;
      allow write: if false;
    }
  }
}

```

#### `FirebaseError: false for 'get' @ L5`
means the collection/doc is not accessible, check firestore rules.


#### `⚠  functions: Your function timed out after ~60s. To configure this timeout, see`
Happened when I was not returning anything from a `onRequest` function. Solution is `response.send()`.

```
⚠  functions: Error: Cannot encode value: () => {
            return entry;
        }
```
Happens when saving objects that are not compatible with firestore, just `JSON.parse(JSON.stringify(data))`

#### `GET http://localhost:3000/_next/static/chunks/fallback/node_modules_next_dist_client_dev_noop_js.js net::ERR_ABORTED 404 (Not Found)`
Don't know why this happens, maybe next is trying to prefetch non-existent Links, so check links and try doing `npm run build`
remove `.next` and do `npm run build` again
Try fiddling around with links 
```<Link href="/tasks/[taskid]" as={`/tasks/${task._id}`}>```

#### `Hot reload not working but restarting dev works.`
Check imports case sensitive! casing matters, bad casing prevents hot reload, try naming all files lowercase to avoid this pitfall in the future.
If you try to hit /users and your directory structure looks like pages/Users, the page will render, but will not hot reload.

#### `Firebase storage error`
```
index.esm2017.js?1fd5:797 Uncaught (in promise) FirebaseError: Firebase Storage: User does not have permission to access 'images/Screen Shot 2021-10-03 at 4.07.46 PM.png'. (storage/unauthorized)
{
  "error": {
    "code": 403,
    "message": "Permission denied."
  }
}
```

Change check storage.rules!

#### `UNSOLVED`
```
Unhandled Runtime Error
TypeError: Cannot read properties of undefined (reading 'indexOf')
 > 28 | const ref = doc(db, "subs", sid)
     |                ^
```
Both `doc` and `db` are defined.. so what is going on? I don't know.


#### `Next build document is not defined`
```
^ ReferenceError: document is not defined
at initialize (/Users/carlo/firegym/node_modules/@firebase/app-check/dist/index.cjs.js:1027:24)
at ReCaptchaV3Provider.initialize (/Users/carlo/firegym/node_modules/@firebase/app-check/dist/index.cjs.js:1166:9)
at _activate (/Users/carlo/firegym/node_modules/@firebase/app-check/dist/index.cjs.js:1328:23)
at initializeAppCheck (/Users/carlo/firegym/node_modules/@firebase/app-check/dist/index.cjs.js:1297:5)
at Object.1748 (/Users/carlo/firegym/.next/server/chunks/748.js:54:73)
at __webpack_require__ (/Users/carlo/firegym/.next/server/webpack-runtime.js:25:42)
at Object.6767 (/Users/carlo/firegym/.next/server/pages/_app.js:22:14)
at __webpack_require__ (/Users/carlo/firegym/.next/server/webpack-runtime.js:25:42)
at __webpack_exec__ (/Users/carlo/firegym/.next/server/pages/_app.js:225:39)
at /Users/carlo/firegym/.next/server/pages/_app.js:226:66 {
type: 'ReferenceError'
```

happens when trying to access the document on client side but nextjs is building it as a server side function (in which case `document` is not defined on nodejs.) Change routes to non api/ and also try dynamically importing `https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr`

```
if (typeof window !== 'undefined') {
  myClientPkg = require('some-pkg')
}
```

#### Dynamic css classes not applying
https://github.com/tailwindlabs/tailwindcss/discussions/2963

You can still dynamically generate your classes. The regex used is deliberately naive. As long as a class appears somewhere in your source code it won't be purged. You just have to make sure the class appears in its entirety.

See https://regex101.com/r/ACVBNg/1 for an example.

The important thing is not to try and construct a class by building from substrings. E.g.

const bgColor = 'white'
return <div className={`bg-${bgColor}`} />
As bg-white never appears in its entirety it will be purged.

In my case this was not the problem. It seemed to be a problem with the glob selector
### npm run dev not starting
`sudo lsof -ti:3000`

when running `kill -9 <pid>` we get 'operation not permitted', usually because of a running background node instance.

`sudo pkill node`

#### npm ci && npm run build failing
```
[=   ] info  - Generating static pages (0/24)
Error occurred prerendering page "/signup/company". Read more: https://nextjs.org/docs/messages/prerender-error
Error: No router instance found.
You should only use "next/router" on the client side of your app.
```
In my case I had a `import router from 'next/router'` and was using `router.query` , when it should be `const router = useRouter()`. Check router.push is only happening on the client side!

Make sure to move any non-pages out of the pages folder
Check for any code that assumes a prop is available, even when it might not be
Set default values for all dynamic pages' props (avoid undefined, use null instead so it can be serialized)
Check for any out of date modules that you might be relying on
Make sure your component handles fallback if it is enabled in getStaticPaths. Fallback docs
Make sure you are not trying to export (next export) pages that have server-side rendering enabled (getServerSideProps)

### Dev stripe accounts
Substitute `stripeAccountID` for the following to get the desired behavior.

1. complete: acct_1KCe5c2cSEZKTEoo