function pollControllers() {
    var controllers = []
      , cData = "";

    for (var i=0; i<3; i++) {
        cData = xouya.getController(i);
        controllers.push(JSON.parse(cData));
    }

    return controllers;
}
