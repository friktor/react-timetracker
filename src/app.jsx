/* require all deps & save in global scope*/
window.TapEventPlugin = require('react-tap-event-plugin');
window.ReactMixin = require('react-mixin');
window.mui = require('material-ui');
window.Radium = require('radium');
window.Reflux = require('reflux');
window.React = require('react');
window.moment = require('moment');
window.Colors = mui.Styles.Colors;

/* define & initial Tasks (Store & Actions) */
require('./stores/tasks.jsx');

/* new instanse theme for root component */
var ThemeManager = new mui.Styles.ThemeManager();
/* sidebar component with content */
var Sidebar = require('./components/sidebar.jsx');
/* Task components define */
var { Add, TaskList } = require('./components/tasks/index.jsx');

var {
  AppBar,
  LeftNav,
} = mui;

@Radium
class App extends React.Component {
  constructor() {
    super();
    this.sidebarToggle = this.sidebarToggle.bind(this);
  }

  /* initial theme context for Material-UI*/
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  /* set themes for alone components (Material-UI)*/
  componentWillMount() {
    ThemeManager.setComponentThemes({
      toggle: {
        thumbOnColor: Colors.lightGreen500,
        trackOnColor: Colors.lightGreen200
      },
      appBar: {
        color: Colors.lightGreen600
      },
    });
  }

  /* toggle sidebar*/
  sidebarToggle() {
    this.refs.sidebar.toggle();
  }

  render() {
    var Style = require('./style/app.jsx');

    /* props for main components*/
    var props = {
      appbar: {
        onLeftIconButtonTouchTap: this.sidebarToggle,
        title: "TimeTracker"
      },
      sidebar: {
        header: <Sidebar />,
        ref: "sidebar",
        menuItems: [],
        docked: false
      },
      container: {
        style: Style.container
      },
      content: {
        style: Style.content,
        key: "content"
      },
    };

    return (
      <div>
        <AppBar {...props.appbar} />
        <LeftNav {...props.sidebar} />

        <div {...props.container}>
          <div {...props.content}>
            <Add />
            <TaskList />
          </div>
        </div>
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};

/* Inject tap plugin react*/
TapEventPlugin();

/* Render */
React.render(<App/>, document.body);
