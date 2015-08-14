var {
  ListDivider,
  ListItem,
  Toggle,
  List,
} = mui;

var Icons = require('./icons.jsx');
var Styles = require('../style/sidebar.jsx');

/* count tasks by status active*/
function countByStatus(active) {
  var tasks = JSON.parse(localStorage.tasks), count = 0;
  for (var i = 0; i<tasks.length; i++) if (tasks[i].active == active) count++;
  return count;
}

/* sidebar header with header image */
class Header extends React.Component {
  render() {
    return <div style={Styles.header}></div>;
  }
}

/* items list for sidebar with count info */
@ReactMixin.decorate(Reflux.ListenerMixin)
class Items extends React.Component {
  constructor() {
    super();
    this.onUpdateTasks = this.onUpdateTasks.bind(this);
    /* set current count data state*/
    this.state = {
      stoped: countByStatus(false),
      active: countByStatus(true)
    };
  }

  componentDidMount() {
    /* add components listeners */
    this.listenTo(Tasks.add, this.onUpdateTasks);
    this.listenTo(Tasks.resume, this.onUpdateTasks);
    this.listenTo(Tasks.remove, this.onUpdateTasks);
    this.listenTo(Tasks.stop, this.onUpdateTasks);
  }

  /* update count info if changes */
  onUpdateTasks() {
    this.setState({
      stoped: countByStatus(false),
      active: countByStatus(true)
    });
  }

  render() {
    /* props for list component */
    var props = {
      tasks: {
        leftIcon: <Icons.assignment style={{left: 18}}/>,
        primaryText: "Tasks",
        open: false,
      }
    };

    return (
      <List>
        <ListItem {...props.tasks}>
          <ListItem primaryText={`Active tasks (${this.state.active})`} />
          <ListItem primaryText={`Stoped tasks (${this.state.stoped})`} />
        </ListItem>
        <ListDivider inset={false} />
        <ListItem primaryText="© Anton Shramko" />
      </List>
    );
  }
}

/* extend components for sidebar data*/
class Sidebar extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Items />
      </div>
    );
  }
}

module.exports = Sidebar;
