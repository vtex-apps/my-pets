  # VTEX IO Web Framework Best-Practices

  ## Application Disclaimer

  This app and all affiliated services are provided “as is”, without warranty of any kind, either express or implied. Neither the publisher nor its partners, affiliates, employees, or contractors guarantee that this app will meet your requirements, provide uninterrupted use, or operate without delay or without error. Neither the publisher nor its partners, affiliates, employees, or contractors assume any responsibility for any errors and malfunctions within the app and will not provide support or maintenance of any kind.
 

  All provisions and warranties of any kind, express or implied, including but not limited to any guarantees of performance, process integrity, or particular functionalities, are hereby disclaimed and excluded unless otherwise prohibited or restricted by applicable law.

  _Developed under EE FPA._

  ## Welcome
  While coding apps, developers face common problems and patterns that are not strictly related to their business logic, like pagination and editing entities. To help you focuss more on your business logic, and less on reinventing the wheel, this repo was created aimming to contain all common patterns, all while respecting **Web Framework's** best practices and performance.

  ## What can I learn in this code base?
  In this repo you will learn how to:

  - Use [VTEX Styleguide](https://styleguide.vtex.com/)
  - Internationalize your app
  - GraphQL (Back-End):
    - Architecture a GraphQL Schema
    - Create resolvers
    - Use Datasources
  - Front-End
    - Use extension points
    - Automatic cache updates
    - Preview with GraphQL cache
    - Pagination

  ## Can I use this repo in my projects ?
  Sure! this repository was designed with this goal in mind. If you are not able to easily port this code into your app, feel free to make a PR and start [contributing](https://github.com/vtex-apps/awesome-io#contributing).

  ## Getting Started
  This repo is an IO app like any other, so getting started is easy, just clone it, open your terminal, and type:

  \`\`\`sh
  vtex link
  \`\`\`

  just enter the \`/guide\` route and play a little

  ## How to read this repo
  An antipattern present in this repo is that the front and back-end code are in the same app. Usually they are split into different apps, given their differences in development cycle. Also, if your project is big enought, it's suggested you split your front-end app into a components app and a **Pages** app (app that places and instanciates these components). For the sake of simplicity and example efficiency, all these apps are joined into this one

  ### Basic architecture
  Since *web-framework-guide* is a VTEX IO app like any other, its folder structure is well known. In the root folder you can find a \`manifest.json\`, containing all of the app's metadata, like name, vendor, version etc. Also, you will find the following folders, each one matching it's corresponding builder

  - node - *where you actually implement your back-end app*
  - graphql - *where you define your graphql schema*
  - react - *where you write your react components*
  - pages - *where you place and instanciate the components*

  ### What if I didn't understand something ?
  If you didn't understand something or if you think this doc is incomplete, please open an issue in GitHub!
