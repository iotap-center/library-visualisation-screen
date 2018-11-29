setInterval(function () {
    // Function that calls a GET-request every 5th second to fetch user data
    $.get('http://iotap-library-visualisation-screen.eu-west-1.elasticbeanstalk.com/data', function(data) {
      // Loads in data of users total time spent at different beacons
      // and pushes the data to graph visualizer
      var cube = data.visits.cube;
      var diss = data.visits.diss1 + data.visits.diss2 + data.visits.diss3;
      var ecos = data.visits.ecos1 + data.visits.ecos2 + data.visits.ecos3;
      var wtw = data.visits.wtw1 + data.visits.wtw2 + data.visits.wtw3 + data.visits.wtw4 + data.visits.wtw5;
      var values = [cube, diss, ecos, wtw];
      Plotly.restyle('my-graph', 'values', [[values]]);
  
  
      // Loads in users answers and shows a fake ad according to answers given
      var answers = data.answers;
      // AI Legal (set picture)
      if (answers.wtw1 == "no" && answers.wtw3 == "yes" && answers.wtw5 == "correct") {
        $("img").attr("src", "../public/images/ailegal.png");
      } 
      // Smart Security (set picture)
      else if (answers.wtw3 == "no") {
        $("img").attr("src", "../public/images/smartsecurity.png");
      }
      // Surrogate (set picture)
      else if (answers.wtw1 == "yes" && answers.wtw5 == "correct") {
        $("img").attr("src", "../public/images/surrogate.png");
      }
      // Vitacrispr (set picture)
      else if (answers.wtw3 == "dontKnow" && answers.wtw4 == "wrong" && answers.wtw5 == "wrong") {
        $("img").attr("src", "../public/images/vitacrispr.png");
      }
      else {
        $("img").attr("src", "../public/images/surrogate.png");
      }
  
    });
  }, 5000);
  
// Donut chart config
var data = [{
    values: [],
    labels: ['The Cube', 'DISS', 'ECOS', 'Walk the Library'],
    type: 'pie',
    hole: 0.4
}];

// Donut chart creation
Plotly.newPlot('my-graph', data);