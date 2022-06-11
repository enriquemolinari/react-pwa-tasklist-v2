import React from "react";
import "./App.css";
import TasksList from "./TasksList";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Menu from "./Menu";
import Login from "./Login";
import Welcome from "./Welcome";
import { Route, Routes } from "react-router-dom";
import { useOffLineDetector } from "@enrique.molinari/react-hook-offline-detector";
import OfflineAlert from "./OfflineAlert";

function App() {
  const isOnLine = useOffLineDetector({});

  return (
    <>
      <OfflineAlert offline={!isOnLine} />
      <Routes>
        <Route
          path={"/"}
          element={
            <>
              <Menu isOnLine={isOnLine} />
              <Welcome />
            </>
          }
        />
        <Route
          path={"/tasklist"}
          element={
            <>
              <Menu isOnLine={isOnLine} />
              <TasksList isOnLine={isOnLine} />
            </>
          }
        />
        <Route exact path={"/login"} element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
