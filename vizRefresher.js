let datasources = [];
let intervalFunc;
document.addEventListener('DOMContentLoaded', () => {
    tableau.extensions.initializeAsync().then( () => {
        const dashboard = tableau.extensions.dashboardContent.dashboard;
        let promises = []
        for (let ws of dashboard.worksheets) {
        promises.push(ws.getDataSourcesAsync())
        }
        Promise.all(promises)
        .then(ds2dArray => { 
            ds2dArray.map(dsArray => datasources.push(...dsArray));
        })
        .then(() => {
            let interval = tableau.extensions.settings.get("interval");
            interval = interval ? interval : 5;
            setNewInterval(interval);
        });
    });

});

function refreshDatasources() {
    for (let ds of datasources) {
        ds.refreshAsync();
    }
}

function loadConfig() {
    tableau.extensions.ui.displayDialogAsync("http://localhost:8888/refresherConfig.html")
    .then(setNewInterval);
}

function setNewInterval(interval) {
    clearInterval(intervalFunc);
    intervalFunc = setInterval(refreshDatasources, interval * 1000);
    document.getElementById('intervalDisplay').innerHTML = interval.toString();
    tableau.extensions.settings.set("interval", interval);
    tableau.extensions.settings.saveAsync();
}