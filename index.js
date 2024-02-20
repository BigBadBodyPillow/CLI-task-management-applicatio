#!/usr/bin/env node

/*
 choice of colours were based of the depicion in the vscode terminal;
 colours in the cmd will most likely look a bit different, and might,
 result in slightly reduced text readability.
*/

// links because checking the docs with a control click is easier than searching it manually

//used for colored text
import chalk from 'chalk'; // https://www.npmjs.com/package/chalk?
import chalkAnimation from 'chalk-animation'; // https://www.npmjs.com/package/chalk-animation
import gradient from 'gradient-string'; // https://www.npmjs.com/package/gradient-string

// ascii art
import figlet from 'figlet'; // https://www.npmjs.com/package/figlet

// spinners
import { createSpinner } from 'nanospinner'; // https://www.npmjs.com/package/nanospinner

//required by the scenario
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'process';

/*
the timeout allows user to read logs and generally i belive that
artificially slowing down an applicationis not good, however in
this case i believe it adds to the experience,and general "flow" of the app
*/
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

//individual task
class Task {
  // constructor for each task
  constructor(TempID, TempTitle, TempDescription) {
    this.completed = false;
    this.id = TempID;
    this.title = TempTitle;
    this.description = TempDescription;
  }

  // change task completed to true (false my default)
  markCompleted() {
    this.completed = true;
  }
}
// dealing with all tasks
class TaskManager {
  constructor() {
    this.tasks = [];
    this.currentID = 1;
  }
  // add a task to the object
  addTask(title, description) {
    const task = new Task(this.currentID, title, description);
    // add new task to object
    this.tasks.push(task);
    // increment id for next task
    this.currentID++;

    console.log(chalk.bgGreen.black('Task added sucessfully!'));
  }
  // checks if completed property is true, if true then mark it completed
  completeTask(id) {
    //validation
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.markCompleted();
      console.log(`${chalk.bgGreen.black('Task marked as completed.')}`);
    } else {
      console.log(`${chalk.bgRed.black('No tasks found.')}`);
    }
  }
  // list of tasks
  listTasks() {
    if (this.tasks != '') {
      console.log(`${chalk.bgGreen.black('Tasks:')}`);
      this.tasks.forEach((task) => {
        if (task.completed) {
          console.log(`[X] ${task.id}: ${task.title} - ${task.description}`);
        } else {
          console.log(`[ ] ${task.id}: ${task.title} - ${task.description}`);
        }
      });
    } else {
      console.log(`${chalk.bgRed.black('No tasks found.')}`);
    }
  }
  deleteTask(id) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      console.log(chalk.bgGreen.black('Task deleted sucessfully!'));
    } else {
      console.log(`${chalk.bgRed.black('No tasks found.')}`);
    }
  }
}
function runTaskManager() {
  const taskManager = new TaskManager();
  // brief intorduction before directing to the home "page"
  async function Welcome() {
    console.clear();
    const rainbowTitle = chalkAnimation.rainbow('Task Management Application');
    await sleep();
    rainbowTitle.stop();
    console.log(`${chalk.magenta.black('---------------------------')}`);
    await home();
  }
  // sort of like a home page,acts as the navigation to the rest of the program
  async function home() {
    console.log(
      '1. Add task \n2. Mark a task as completed \n3. List tasks \n4. Delete a task \n5. Exit'
    );

    // recieve answer from user regarding their choice selecrtion
    const rl = readline.createInterface({ input, output });
    const numChoice = await rl.question(
      `${chalk.bgCyan.black('Enter your choice:')}`
    );
    handleAnswer(numChoice);
    rl.close();
  }

  // determine what happens depending of the choice the user selects
  async function handleAnswer(selection) {
    const spinner = createSpinner('Loading...').start();
    await sleep();
    //switch was annoying so.. i just used "ol reliable" if
    if (selection == 1) {
      spinner.success({ text: `Add a new task` });
      taskAdd();
    } else if (selection == 2) {
      spinner.success({ text: `Mark a task as completed` });
      taskCompleted();
    } else if (selection == 3) {
      spinner.success({ text: `List tasks` });
      taskList();
    } else if (selection == 4) {
      spinner.success({ text: `Delete a task` });
      taskDelete();
    } else if (selection == 5) {
      spinner.warn({ text: `Exiting` });
      thanks();
    } else {
      // if the entered value was one of the specified options,
      // thorw and error message and direct back to the home "page"
      spinner.error({
        text: `${chalk.bgRed.black(
          'Invalid choice!'
        )} Please choose between ${chalk.bgGreen.black('1 - 5')}.`,
      });
      await sleep();
      await Welcome();
    }
  }

  // if the "add a task" or 1 choice was made ,this function will be called
  async function taskAdd() {
    const rl = readline.createInterface({ input, output });
    const title = await rl.question(
      `${chalk.bgCyan.black('Enter task title: ')}`
    );
    const desc = await rl.question(
      `${chalk.bgCyan.black('Enter task description: ')}`
    );
    rl.close();
    //send inputs to the method
    taskManager.addTask(title, desc);

    // console.log(chalk.bgGreen.black("Task added sucessfully!"));
    await sleep();
    await Welcome();
  }
  //if the "mark task as completed" or 2nd choice was made, this function will be called
  async function taskCompleted() {
    const rl = readline.createInterface({ input, output });
    const id = await rl.question(
      `${chalk.bgCyan.black('Enter task ID to mark as completed: ')}`
    );
    rl.close();
    //send input to the method
    taskManager.completeTask(parseInt(id));

    await sleep();
    await Welcome();
  }
  // if list taskts" or the 3rd choice was selected, this function will be called
  async function taskList() {
    //direct to the method
    taskManager.listTasks();
    const rl = readline.createInterface({ input, output });
    //the usual 2 second sleep would not be enough to read tasks
    await rl.question(
      `${chalk.bgMagentaBright.black('anything to continue...')}`
    );
    // confimation.stop();
    rl.close();
    // await sleep();
    await Welcome();
  }

  // if "delete a task" or the 4th seleclearction was made, this function will be called
  async function taskDelete() {
    const rl = readline.createInterface({ input, output });
    const id = await rl.question(
      `${chalk.bgCyan.black('Enter task ID to delete: ')}`
    );
    rl.close();
    //send input to the method
    taskManager.deleteTask(parseInt(id));

    await sleep();
    await Welcome();
  }

  // little bit of fun with ascii art
  function thanks() {
    console.clear();
    figlet(`Thanks, for\n     using my\n       App! < 3`, (err, data) => {
      console.log(gradient.pastel.multiline(data) /*+ "\n" */);
      process.exit(0);
    });
  }

  Welcome();
}
runTaskManager();
