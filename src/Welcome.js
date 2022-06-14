import Container from "react-bootstrap/Container";
import { useLocation } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { tasks as tasksService } from "./server/tasks.js";
import { tasks as tasksLocalService } from "./local/tasks.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Welcome() {
  const location = useLocation();

  function handleCheckWhatsOnServer() {
    tasksService.retrieveAll().then((json) => {
      console.log(json);
      toast.success("Items retrieved from server and printed on console");
    });
  }

  function handleStartFromServer() {
    if (window.confirm("I will proceed, ok?") === true) {
      tasksLocalService.startFromServer().then(() => {
        toast.success(
          "Everything was retrieved from server and created locally"
        );
      });
    }
  }

  return (
    <Container fluid className="mainBody">
      <ToastContainer />
      <Card>
        <Card.Header as="h5">Welcome !</Card.Header>
        <Card.Body>
          <p>{location.state}</p>
          <p>
            Welcome to the Task List Application. This is to demonstrate how to
            create a <b>Progressive Web App</b> with React.
          </p>
          <p>
            Do you want to check which items are on the server?
            {"  "}
            <Button onClick={handleCheckWhatsOnServer}>Click here!</Button>
          </p>
          <p>
            Do you want to clear everything and retrieve all items from server?
            {"  "}
            <Button onClick={handleStartFromServer}>Start from Server</Button>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
