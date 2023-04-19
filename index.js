#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const readline = require("readline");
const keypress = require("keypress");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const cwd = process.cwd();

try {
  const filename = path.join(cwd, ".cmdlist");
  const fileData = fs.readFileSync(filename, "utf8");
  const commands = fileData.split("\n").map((line) => line.trim());

  const options = commands.map((command) => command.split("::")[0]);

  let selectedOptionIndex = 0;

  const displayOptions = () => {
    console.clear();
    console.log("\nChoose an option:\n");
    options.forEach((option, index) => {
      if (index === selectedOptionIndex) {
        console.log(`\x1b[36m> ${option}\x1b[0m`);
      } else {
        console.log(`  ${option}`);
      }
    });
    console.log("\nUse arrow keys to navigate and press enter to select.");
  };

  displayOptions();

  keypress(process.stdin);

  process.stdin.on("keypress", (ch, key) => {
    if (key && key.name === "up") {
      selectedOptionIndex = Math.max(0, selectedOptionIndex - 1);
      displayOptions();
    } else if (key && key.name === "down") {
      selectedOptionIndex = Math.min(
        options.length - 1,
        selectedOptionIndex + 1
      );
      displayOptions();
    } else if (key && key.name === "return") {
      console.clear();
      const selectedOption = options[selectedOptionIndex];
      const selectedCommand = commands[selectedOptionIndex].split("::")[1];
      console.log(`\nYou selected: \x1b[36m${selectedOption}\x1b[0m\n`);
      console.log(`Running command: \x1b[33m${selectedCommand}\x1b[0m\n`);
      rl.close();
      exec(selectedCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`\x1b[31mError:\x1b[0m ${error.message}`);
        } else if (stderr) {
          console.error(`\x1b[31mError:\x1b[0m ${stderr}`);
        } else {
          console.log(`\x1b[32mOutput:\x1b[0m ${stdout}`);
        }
      });
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
} catch (err) {
  console.error(err);
}
