## CHAT COMMANDS
Create a file with your commands name.

`say.js`

```node
module.exports.info = {
  "title" : "Say 💬", // User friendly title.
  "name" : "say", // Command name to trigger function.
  "desc" : "Say any word", // Description for "help" command.
}
/**
 * Use client parameter for any global variable (config, helpers, etc.)
 * Args[array] parameter contains any string placed after the command. (Separated by spaces)
 * **/
module.exports.execute = (client, message, args) => {
  message.channel.send(args[0]);
};
```
