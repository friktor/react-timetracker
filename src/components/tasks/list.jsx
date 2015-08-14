var {
  IconButton,
  ListItem,
  IconMenu,
  List,
  Paper
} = mui;

/* fixes as material-ui 0.10.2 */
var MenuItem = require('material-ui/lib/menus/menu-item');
/* icons */
var Icons = require('../icons.jsx');
/* define styles */
var Styles = require('../../style/task.jsx');

/* math ceil number float */
function ceilFloat(number, digits) {
  var powered, tmp, result
  if (isNaN(number)) return number;

  var powered = Math.pow(10,digits);
  var tmp = number*powered;

  tmp = Math.round(tmp);
  return tmp/powered;
}

@ReactMixin.decorate(Reflux.ListenerMixin)
class TaskList extends React.Component {
  constructor() {
    super();
    this.onUpdateTasks = this.onUpdateTasks.bind(this);
  }

  componentDidMount() {
    /* add components listeners */
    this.listenTo(Tasks.add, this.onUpdateTasks);
    this.listenTo(Tasks.resume, this.onUpdateTasks);
    this.listenTo(Tasks.remove, this.onUpdateTasks);
    this.listenTo(Tasks.stop, this.onUpdateTasks);
  }

  /* method for update view after store changes */
  onUpdateTasks() {
    this.forceUpdate();
  }

  render() {
    var Style = Styles.list;
    var tasks = JSON.parse(localStorage.tasks).map((task, index) => {
      return <TaskItem key={`task-${task.started}`} task={task} />;
    });

    return (
      <List style={Style}>
        {tasks}
      </List>
    );
  }
}

class TaskMenu extends React.Component {
  constructor() {
    super();
    this.actionHandle = this.actionHandle.bind(this);
  }

  actionHandle(e, item) {
    var value = item._store.props.primaryText;
    var task = this.props.task;

    switch (value) {
      /* send resume action & run bind fn for resume elapse update*/
      case "Resume":
        Tasks.resume(task.started);
        this.props.start();
        break;
      /* send stop action & run bind fn for stop elapse update*/
      case "Stop":
        Tasks.stop(task.started);
        this.props.stop();
        break;
      /* send remove task action*/
      case "Remove":
        Tasks.remove(task.started);
        break;
    }
  }

  render() {
    var Icon = <IconButton tooltip="Actions Task"><Icons.moreVert /></IconButton>;
    var task = this.props.task;

    /* styles with fixes iconMenu as button in list*/
    var style = {
      border: '10px none', boxSizing: 'border-box',
      width: 48, height: 48, top: 12, right: 4,
      display: 'block', position: 'absolute'
    };

    /* menu props */
    var menu = {
      onItemTouchTap: this.actionHandle,
      iconButtonElement: Icon,
      style: style,
    };

    return (
      <IconMenu {...menu}>
        <MenuItem primaryText="Resume" />
        <MenuItem primaryText="Stop" />
        <MenuItem primaryText="Remove" />
      </IconMenu>
    );
  }
}

class TaskItem extends React.Component {
  constructor() {
    super();
    this.startElapsedUpdate = this.startElapsedUpdate.bind(this);
    this.updateElapsedTime = this.updateElapsedTime.bind(this);
    this.stopElapsedUpdate = this.stopElapsedUpdate.bind(this);
    this.state = {};
  }

  /* start interval updated state data elapsed time current task */
  componentDidMount() {
    if (this.props.task.active) this.startElapsedUpdate();
    else this.setState({elapsed: this.props.task.elapsed});
  }

  /* clear interval after unmount*/
  componentWillUnmount() {
    this.stopElapsedUpdate();
  }

  /* method for update data elapsed time*/
  updateElapsedTime() {
    var task = this.props.task;
    this.setState({
      elapsed : (new Date().getTime() - task.lastState)+task.elapsed
    });
  }

  /* start elapsed update handle */
  startElapsedUpdate() {
    this.elapsedInterval = setInterval(this.updateElapsedTime, 250);
  }

  /* stop elapsed update handle */
  stopElapsedUpdate() {
    clearInterval(this.elapsedInterval);
    this.elapsedInterval = null;
  }

  render() {
    /* get task from props*/
    var {task} = this.props;
    /* formating date started task*/
    var formatedStarted = moment(new Date(task.started)).format('DD.MM.YY, HH:mm:ss:SS');
    /* calc color status*/
    var statusColor = task.active ? {fill: Colors.green500} : {fill: Colors.red500};
    /* define style */
    var Style = Styles.item;

    /* Calc formated elapsed time */
    var formatedElapsed = ((elapsed) => {
      var minutes = Math.floor(elapsed/60000);
      var seconds = Math.floor((elapsed-(minutes*60000))/1000);
      var millsec = Math.ceil(((elapsed-(minutes*60000))-(seconds*1000))/10);
      return {
        text: `${minutes}:${seconds}:${millsec}`,
        number: [minutes, seconds, millsec]
      };
    })(this.state.elapsed);

    /* Calc earned money from elapsed time */
    var earned = ((pay) => {
      var elapsed = formatedElapsed.number;
      return ceilFloat(((elapsed[0]/60)*pay)+((elapsed[1]/60/60)*pay), 2);
    })(task.pay);

    /* task menu button props*/
    var taskMenu = {
      start: this.startElapsedUpdate,
      stop: this.stopElapsedUpdate,
      task: task
    };

    /* formated data task (secondary text)*/
    var taskData = <p>
      {task.name} |
      elapsed : {formatedElapsed.text} |
      hours pay : {task.pay} RUR |
      earned : {earned} RUR
    </p>;

    /* item props */
    var item = {
      leftIcon: <Icons.watch style={statusColor}/>,
      rightIconButton: <TaskMenu {...taskMenu}/>,
      primaryText: `Added ${formatedStarted}`,
      secondaryText: taskData,
    };

    return <ListItem {...item} />
  }
}

module.exports = TaskList;
