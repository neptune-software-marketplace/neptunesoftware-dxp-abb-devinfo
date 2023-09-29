if (this.getPressed()) {
    SplitterLayoutData3.setSize("50%");
    SplitterLayoutData3.setResizable(true);

    setTimeout(function () {
        SplitterLayoutData3.rerender();
    }, 10);

    butToggleBundleSelection.setIcon("sap-icon://screen-split-two");
    butToggleBundleSelection.setTooltip("Hide Artifact Selection");
} else {
    SplitterLayoutData3.setSize("0px");
    SplitterLayoutData3.setResizable(false);

    butToggleBundleSelection.setIcon("sap-icon://screen-split-one");
    butToggleBundleSelection.setTooltip("Show Artifact Selection");
}
