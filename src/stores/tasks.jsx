var stringify = JSON.stringify;

/*
* Task Schema
* {
*   lastState: Int,
*   name: String,
*   started: Int,
*   elapsed: Int,
*   active: Bool,
*   pay:Int
* }
*/

window.Tasks = Reflux.createActions([
  'remove',
  'resume',
  'stop',
  'add'
]);

function findTask(id, tasks) {
  var target = -1;
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].started == id) {
     target = i;
     break;
    }
  }
  return target;
}

window.TasksStore = Reflux.createStore({
  /* listen bind all actions tasks */
  init() {
    if (!localStorage.tasks) localStorage.tasks = stringify([]);
    this.listenToMany(Tasks);
  },

  onAdd(name, pay) {
    /* set initial state`s*/
    var task = { active: true, elapsed: 0, name: name, pay: pay };
    task.lastState = task.started = new Date().getTime();

    /* Get & parse tasks, add to array*/
    var tasks = JSON.parse(localStorage.tasks);
    tasks.push(task);

    /* change */
    localStorage.tasks = stringify(tasks);
    console.log(tasks);
  },

  onStop(id) {
    /* find target tasks */
    var tasks = JSON.parse(localStorage.tasks);
    var target = findTask(id, tasks);
    /* get task data*/
    var task = tasks[target];
    /* add to elapsed time - time elapsed since the last state activated */
    task.elapsed += new Date().getTime() - new Date(task.lastState);
    task.active = false;

    /* save task*/
    tasks[target] = task;
    localStorage.tasks = stringify(tasks);
  },

  onResume(id) {
    /* find target tasks */
    var tasks = JSON.parse(localStorage.tasks);
    var target = findTask(id, tasks);

    /* get task data*/
    var task = tasks[target];
    /* put a new last active time status */
    task.lastState = new Date().getTime();
    task.active = true;

    /* save task*/
    tasks[target] = task;
    localStorage.tasks = stringify(tasks);
  },

  onRemove(id) {
   /* find target task */
   var tasks = JSON.parse(localStorage.tasks);
   var target = findTask(id, tasks);

   /* remove task & save result */
   tasks.splice(target, 1);
   localStorage.tasks = stringify(tasks);
  }
});
