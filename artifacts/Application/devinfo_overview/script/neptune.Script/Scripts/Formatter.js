const typeTexts = {
    package: "Package",
    launchpad: "Launchpad",
    tile_group: "Tile Group",
    tile: "Tile",
    api_group: "API Group",
    api: "API",
    api_operation: "API Operation",
    script_project: "Script Project",
    script: "Script",
    app: "Application",
    adaptive: "Adaptive App",
    connector: "Connector",
    table: "Table",
    role: "Role",
    authentication: "Authentication",
    job: "Job",
    workflow_definition: "Workflow"
}
function getTypeText(type) {
    return typeTexts[type] ? typeTexts[type] : type;
}