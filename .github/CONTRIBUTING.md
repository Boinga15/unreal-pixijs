# How to Contribute
At any time when using Unreal PixiJS, if you find a bug or want to add a new feature for everyone to use, then feel free to contribute to the project in any way. Contributions helps shape Unreal PixiJS and make it a lot better, as there's only so much one person can do alone.

## Reporting Issues
To report a bug, request a feature, or ask a question, you can use Github's pre-built "Issues" section.

1. On Unreal PixiJS' "[Issues](https://github.com/Boinga15/unreal-pixijs/issues)" page and quickly scan to see if anyone else has already requested the feature or reported the bug (helps to avoid duplicate requests).

2. Click "new issue" and provide a detailed statement about the issue in question or the new feature request. It's best to have an introduction (what is the request/issue report about), and either what triggered the bug (if you are reporting the bug) or the use-cases for your feature request (if you are requesting a new feature or an update to an existing one).

3. If you are reporting a bug, it is highly recommended that you include your code in the report. That makes it easier to reproduce the bug and will hopefully make it faster to solve.

4. Post your issue and wait for someone to get back to you. Simple as that.

When reporting issues, there are a few things you should try and do in order to make it more likely that the issue can be resolved in a timely manner and in the way you were hoping for:

1. Share as much detail as possible when reporting a bug, your browser  version, OS, library, which browser you used, steps to reproduce, and so on. It's nearly impossible to debug an issue if all you provide is "X isn't working". Code that causes the bug, if known, is also helpful, along with any error messages.

2. When requesting a feature, it always helps to show where you or others would use the feature, even if it's as simple as a pre-built widget asset or script. This helps future documentation, since providing examples makes it easier for people to see where they would use the feature.

## Contributing Changes
### Setup
If you want to fix a bug or implement a feature, you can download the code and set it up to allow you to edit the source code itself. To do this, you'll need the latest version of NodeJS, and make sure that you also have npm (Node Package Manager) installed as well (if you can create a new Unreal PixiJS project, then you should be good to go). To set up your project:

1. Either download the source code from the git repository, or clone it into a folder.

2. Go into the folder and run "npm install" to install all of the base packages you'll need.

3. Run "npm run test" and "npm run lint" in order to make sure that everything is working (note: "npm run test" will open a web browser. Use "ctrl + shift + I" to open the inspect element page and go to the console to see if the tests passed or failed).

### Publishing Changes
Once everything is set up, you can implement your change. After which, you should take the proper precautions just to make sure that everything still holds up.

1. Run "npm run lint" and "npm run test" again. This will run the test and linting process, and ensure everything still holds. If there is a problem with either, make sure to resolve it.

2. Push your change to this project by starting a new branch, titling it as something appropriate so that others can see what your version is.

3. Once your new feature or bug fix is ready, you can make a pull request to the main branch so that it can be implemented properly into Unreal PixiJS.

If your pull request gets rejected (for some reason), then it's nothing to worry about. I should have left a comment explaining the reason for the rejection, and possibly leaving suggestions on what you can do to make it workable with the main project.

## Code Style Guide
These are more suggestions than requirements, but it's best to try follow these whenever possible. That way, the code looks the same throughout, improving readability.

- Use tabs, never spaces in-place of tabs.
- No trailing white spaces, and blank lines shouldn't have whitespaces whenever possible.
- Using ```===``` or ```==``` are okay, but use ```===``` whenever possible to prevent javascript weirdness.
- Keep checking eslint. If something fails to pass by eslint, resolve it (try to actually fix it, only tell eslint to ignore the problem if absolutely necessary).
- Build the project before publishing your changes in order to ensure everything still works properly.

