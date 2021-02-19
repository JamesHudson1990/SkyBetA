# SkyBetA
To launch the application open the index.html file in your browser.

Due to the way that JS modules have been used within the project, the JavaScript used within the project will not work when served from a local filesystem. For the JavaScript modules to work, the application needs to be run on a web server. To do this locally we reccomend using the 'Live Server' extension for VS Code.

Once you have the Live Server extension for VS code installed, open the project directory in VS code. Right click the index.html file and select the 'Open with Live Server' option. This will locally host the project from your machine and automatically open the index.html file in your default browser, and the JavaScript used by the application will now work.

The reason that this being nessicary is that many browsers do not allow you to access files on the local filesystem with JavaScript (even if the HTML document is also on the local filesystem). This extends to loading JavaScript modules. Running from a web server resolves this issue.

Alternatively you can access the live demo hosted at: https://purple-bush-02e17af03.azurestaticapps.net