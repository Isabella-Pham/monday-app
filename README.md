## Inspiration
Being able to visualize the steps needed to accomplish an end goal improves clarity on what needs to be done. We noticed that while monday.com does have some visualization tools, it was missing a tool where one could create a workflow diagram and add tasks to a board through it. Thus, we were inspired to create our workflow diagram app, **WRKFLW**.
## What it does
**WRKFLW** is an app that allows individuals to create workflow diagrams within monday.com and assign tasks to individuals through the app. It is an improved take on traditional workflow diagrams as the diagram is now interactive, allowing users to assign tasks to teammate(s) who will then be notified on monday.com of the task they were assigned. This app revolutionizes traditional workflow diagrams through its interactivity and improves team collaboration by providing a visual representation of the steps a team must take to reach their end goals.
## How we built it
The front end of the app was programmed in JavaScript using React. When a workflow diagram is created, each aspect of the diagram (e.g. shapes, arrows, text) are saved as a JSON object which stores the x and y coordinates, size, color, and more. An entire graph is saved as a document in MongoDB which contains all JSON objects for that graph, thus a graph can be saved and accessed later. When one teammate is saving a diagram, the server is notified which updates the graph for all teammates viewing the diagram with the changes to promote collaboration. Teams can assign tasks to individuals for each workflow diagram node. When right clicking on a node, it presents the option to delete, edit, change wrapping, as well as manage tasks. Using the monday query API, a list of all individuals in a team is retrieved and the team has the option to assign teammates to new tasks that they create. When a task is assigned to teammate(s), a monday mutation API call is made to send them a notification that they were assigned a task.
## Challenges we ran into
* Saving graphs to access and edit later proved to be a challenge. As the monday storage API was still in beta stages, we realized that it may not be the most efficient way to store graphs. Thus, we archived our code that uses the monday storage API and opted to use mongoDB for the time being.
* There were difficulties deploying to Heroku due to some code not being compatible with the way Heroku deploys projects. As a result, this code needed to be modified.

## Accomplishments that we're proud of
* Being able to work together as a team and developing a well functioning app in a fully remote environment is an accomplishment that illustrated that it's possible to work together productively despite COVID-19.
* Resolving any problems together as a team.
* Working together to learn new technologies in order to write efficient, clean code.

## What we learned
* The inner workings of monday.com’s interface and how it promotes team collaboration.
* The challenges that arise when working as a team with new APIs.
* The challenges of the development process as a whole and how issues are easier to resolve through team collaboration.
* The necessity to organize the steps needed to accomplish our product vision and delegate team assignments to reach our goals.

## What's next for **WRKFLW**
As monday's storage API continues to improve and move out of the beta stage, we would like to move our storage for **WRKFLW**'s diagrams onto the API. Additionally, we want to improve user experience for collaboration in the future and add more shapes and items to be integrated in **WRKFLW**'s diagrams, such as iframes for videos.
