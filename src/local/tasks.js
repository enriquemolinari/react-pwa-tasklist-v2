import { openDB } from "idb";
import { status } from "./taskStatus";
import { tasks as tasksService } from "../server/tasks.js";

export let tasks = (function () {
  const DB_NAME = "taskdb";
  const STORE_DB = "task-store";
  const STORE_QUEUE = "queue-store";
  const OP_ADD = "add";
  const OP_UPDATE = "update";
  const OP_DELETE = "del";

  async function retrieve() {
    let db = await openIndexedDb();
    db.transaction([STORE_DB], "readonly");
    let all = await db.getAll(STORE_DB);
    let addedStatus = all.map((item) => {
      return { ...item, status: status(item.expirationDate) };
    });
    return Promise.resolve({ tasks: addedStatus });
  }

  async function deleteOne(taskToDelete) {
    let db = await openIndexedDb();
    let taskDel = await db.get(STORE_DB, taskToDelete);
    let tx = db.transaction([STORE_DB, STORE_QUEUE], "readwrite");
    await tx.objectStore(STORE_DB).delete(taskToDelete);
    let queueStore = tx.objectStore(STORE_QUEUE);

    queueStore.add({
      text: "",
      expirationDate: "",
      done: false,
      syncId: taskDel.syncId,
      id: uid(),
      op: OP_DELETE,
      queuedTime: Date.now(),
    });

    return tx.done.then(() => {
      navigator.serviceWorker.ready.then((reg) => {
        reg.sync.register("sync-queued-data");
      });
    });
  }

  async function add(expirationDate, text) {
    let db = await openIndexedDb();
    let tx = db.transaction([STORE_DB, STORE_QUEUE], "readwrite");
    let dbStore = tx.objectStore(STORE_DB);
    let syncId = uid();
    let id = uid();

    dbStore.add({
      text: text,
      expirationDate: expirationDate,
      done: false,
      syncId: syncId,
      id: id,
    });

    let queueStore = tx.objectStore(STORE_QUEUE);

    queueStore.add({
      text: text,
      expirationDate: expirationDate,
      done: false,
      syncId: syncId,
      id: id,
      op: OP_ADD,
      queuedTime: Date.now(),
    });

    return tx.done.then(() => {
      navigator.serviceWorker.ready.then((reg) => {
        reg.sync.register("sync-queued-data");
      });
    });
  }

  async function doneOrUndone(done, idTask) {
    let db = await openIndexedDb();
    let taskUpd = await db.get(STORE_DB, idTask);
    taskUpd.done = !done;
    taskUpd.id = idTask;
    let tx = db.transaction([STORE_DB, STORE_QUEUE], "readwrite");
    await tx.objectStore(STORE_DB).put(taskUpd);
    let queueStore = tx.objectStore(STORE_QUEUE);

    queueStore.add({
      text: "", //only done or !done is updated
      expirationDate: "", //only done or !done is updated
      done: !done,
      syncId: taskUpd.syncId,
      id: idTask,
      op: OP_UPDATE,
      queuedTime: Date.now(),
    });

    return tx.done.then(() => {
      navigator.serviceWorker.ready.then((reg) => {
        reg.sync.register("sync-queued-data");
      });
    });
  }

  async function deleteAllQueued() {
    let db = await openIndexedDb();
    return await db.clear(STORE_QUEUE);
  }

  async function getAllQueued() {
    let db = await openIndexedDb();
    return await db.getAll(STORE_QUEUE);
  }

  async function openIndexedDb() {
    return await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_DB)) {
          let dbStore = db.createObjectStore(STORE_DB, {
            keyPath: "id",
          });
        }
        if (!db.objectStoreNames.contains(STORE_QUEUE)) {
          let queueStore = db.createObjectStore(STORE_QUEUE, {
            keyPath: "queuedTime",
          });
        }
      },
    });
  }

  async function startFromServer() {
    let all = await tasksService.retrieveAll();
    let promisesAdd = [];
    let db = await openIndexedDb();
    let tx = db.transaction([STORE_DB, STORE_QUEUE], "readwrite");
    tx.objectStore(STORE_DB).clear();
    tx.objectStore(STORE_QUEUE).clear();
    all.tasks.forEach((task) => {
      promisesAdd.push(tx.objectStore(STORE_DB).add(task));
    });
    await Promise.all(promisesAdd);
    return tx.done;
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  return {
    doneOrUndone: doneOrUndone,
    retrieveAll: retrieve,
    delete: deleteOne,
    addNew: add,
    getAllQueued: getAllQueued,
    deleteAllQueued: deleteAllQueued,
    startFromServer: startFromServer,
  };
})();
