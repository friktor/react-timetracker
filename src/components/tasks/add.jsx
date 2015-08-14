var {
  FlatButton,
  TextField,
  Paper
} = mui;

/* define styles */
var Styles = require('../../style/task.jsx');

class Add extends React.Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
    this.clear = this.clear.bind(this);
    this.state = {
      error: {}
    };
  }

  submit(event) {
    event.preventDefault();
    var name = this.refs.name,
        pay = this.refs.pay;

    var val = {name: name.getValue(), pay: pay.getValue()};
    var valid = {name: false, pay: false};

    /* type valid for pay field value*/
    var payIsNumber = ((pay) => {
      var int = parseInt(pay);
      if (!isNaN(int)) return true;
      else return false;
    })(val.pay);

    /* valid name value */
    if (val.name.trim().length == 0) {
      this.state.error.name = "field is required";
      this.forceUpdate();
    } else valid.name = true;

    /* valid pay value */
    if (val.pay.trim().length == 0 || !payIsNumber) {
      this.state.error.pay = "required field, only integer number";
      this.forceUpdate();
    } else valid.pay = true;

    /* if all valid add */
    if (valid.name && valid.pay) {
      Tasks.add(val.name, parseInt(val.pay));
      name.setValue('');
      pay.setValue('');
    }
  }

  clear() {
    this.setState({error: {}});
  }

  render() {
    var Style = Styles.add;
    var props = {
      name: {
        floatingLabelText: "Task name",
        errorText: this.state.error.name,
        type: "text",
        name: "name",
        ref: "name"
      },
      pay: {
        floatingLabelText: "Pay Task (in RUR)",
        errorText: this.state.error.pay,
        type: "text",
        name: "pay",
        ref: "pay"
      },
      form: {
        onSubmit: this.submit,
        onChange: this.clear,
        style: Style.form
      },
      submit: {
        hoverColor: Colors.lightGreen300,
        style: Style.submit,
        type: "submit",
        label: "Add",
      }
    }

    return (
      <Paper style={Style.root}>
        <h4 style={Style.header}>Add new Task Track</h4>
        <form {...props.form}>
          <TextField {...props.name} />
          <TextField {...props.pay} />
          <FlatButton {...props.submit} />
        </form>
      </Paper>
    );
  }
}

module.exports = Add;
