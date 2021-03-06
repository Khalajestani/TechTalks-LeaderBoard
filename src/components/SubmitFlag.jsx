import React, { Component } from "react";
import {
  Button,
  Input,
  Segment,
  Label,
  Icon,
  Message,
} from "semantic-ui-react";
import SubmitFlagAPI from "../api/SubmitFlag";
import SideMenuBar from "./SideMenuBar";

const SuccessMessage = (props) => {
  return (
    <Message icon className="submitFlagMessage">
      <Icon name="check circle outline" color="green" />
      <Message.Content>
        <Message.Header>Correct!</Message.Header>
        You have been awarded {props.pointsAwarded} points!
      </Message.Content>
    </Message>
  );
};

const FailMessage = () => {
  return (
    <Message icon className="submitFlagMessage">
      <Icon name="exclamation circle" color="red" />
      <Message.Content>
        <Message.Header>Wrong.</Message.Header>
        Flag is incorrect
      </Message.Content>
    </Message>
  );
};

const ReSubmitMessage = () => {
  return (
    <Message icon className="submitFlagMessage">
      <Icon name="exclamation circle" color="yellow" />
      <Message.Content>
        <Message.Header>Update</Message.Header>
        Points for this flag have been rewarded to you before
      </Message.Content>
    </Message>
  );
};

class SubmitFlag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitMessage: "",
      displayName: "",
      exactId: "",
      flag: "",
      displayNameError: "",
      exactIdError: "",
      flagError: "",
    };
  }

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
      displayNameError: false,
      exactIdError: false,
      flagError: false,
    });

  submitFlag() {
    if (!this.state.displayName) {
      this.setState({ displayNameError: true });
    }
    if (!this.state.exactId) {
      this.setState({ exactIdError: true });
    }
    if (!this.state.flag) {
      this.setState({ flagError: true });
    }

    if (this.state.displayName && this.state.exactId && this.state.flag) {
      var body = {
        Name: this.state.displayName.trim(),
        UserID: this.state.exactId.trim(),
        Flag: this.state.flag.trim(),
      };

      SubmitFlagAPI(body)
        .then((res) => {
          this.showMessage(res);
        })
        .catch((error) => {
          console.log({ error });
        });
    }
  }

  showMessage(res) {
    this.setState({
      submitMessage: null,
    });

    switch (res.message) {
      case "Correct":
        setTimeout(
          function () {
            this.setState({
              submitMessage: (
                <SuccessMessage pointsAwarded={res.points_awarded} />
              ),
            });
          }.bind(this),
          350
        );
        break;
      case "Points for this flag is rewarded before":
        setTimeout(
          function () {
            this.setState({
              submitMessage: <ReSubmitMessage />,
            });
          }.bind(this),
          350
        );
        break;
      default:
        // "Wrong"
        setTimeout(
          function () {
            this.setState({
              submitMessage: <FailMessage />,
            });
          }.bind(this),
          350
        );
    }
  }

  render() {
    return (
      <div>
        <div>{this.state.submitMessage}</div>
        <SideMenuBar activeItem="submitflag" />
        <div className="submitflag">
          <h1 style={{ paddingLeft: "5%", paddingTop: "2%" }}>
            Submit your flag
          </h1>

          <div style={{ padding: "5%", paddingTop: "1%", paddingBottom: "7%" }}>
            <Segment style={{ background: "inherit" }}>
              {this.state.displayNameError ? (
                <Label basic color="red">
                  Field is mandatory
                </Label>
              ) : (
                ""
              )}
              <Input
                fluid
                name="displayName"
                onChange={(e) => this.onChange(e)}
                placeholder="Display Name"
              />
            </Segment>
            <Segment style={{ background: "inherit" }}>
              {this.state.exactIdError ? (
                <Label basic color="red">
                  Field is mandatory
                </Label>
              ) : (
                ""
              )}
              <Input
                name="exactId"
                onChange={(e) => this.onChange(e)}
                style={{ display: "flex" }}
                label={{ basic: true, content: "@exactsoftware.com" }}
                labelPosition="right"
                placeholder="Enter your exact ID"
              />
            </Segment>
            <Segment style={{ background: "inherit" }}>
              {this.state.flagError ? (
                <Label basic color="red">
                  Field is mandatory
                </Label>
              ) : (
                ""
              )}
              <Input
                style={{ height: "60px" }}
                fluid
                name="flag"
                onChange={(e) => this.onChange(e)}
                placeholder="Flag"
                value={this.state.flag}
              />
            </Segment>
            <Button
              style={{ marginRight: "16px", marginBottom: "20px" }}
              floated="right"
              positive
              onClick={(e) => this.submitFlag()}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default SubmitFlag;
