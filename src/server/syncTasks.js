export let syncTasks = (function () {
  const apiTask = process.env.REACT_APP_URI_TASK;

  function bulk(tasks) {
    return fetch(apiTask + "/tasks/bulk", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(tasks),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((r) => {
        if (r.status === 401)
          return Promise.reject({
            status: 401,
            msg: "You are not authenticated",
          });
        if (!r.ok) return Promise.reject(r.status);
        return r.json();
      })
      .then((json) => Promise.resolve(json))
      .catch((e) => Promise.reject(e));
  }

  return {
    bulkTasks: bulk,
  };
})();
