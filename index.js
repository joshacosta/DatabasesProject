

/*
I have a script tag that invokes this function in the html upon opening
of the site. firebaseCongig is an object of credentials given from firebase.
it is simply the credentials for MY(our) database. nothing we need to worry
about this info instead of copying it from firebase and pasting it right here.
in the try catch we simply "initalize" the database to be used here in our 
javascript. "db" is a reference to our reference for firebase. We can use firebase.database() 
or db for short, doesn't really matter
*/
window.onload = function(){
    //alert("YEET");
    var firebaseConfig = {
        apiKey: "AIzaSyCRqscU1VB-HDFJj6AryAqqXcS9Jk-FL1M",
        authDomain: "incomedb-52480.firebaseapp.com",
        databaseURL: "https://incomedb-52480.firebaseio.com",
        projectId: "incomedb-52480",
        storageBucket: "incomedb-52480.appspot.com",
        messagingSenderId: "397080402779"
    };

    try {
        var defaultProject = firebase.initializeApp(firebaseConfig);
        console.log(defaultProject.name);  // "[DEFAULT]"
    } catch (error) {
        console.log("-yeet: ", error);
    }

    //defaultStorage = firebase.storage();
    db = firebase.database();
   // writeUserData('11','incomes','josh@test.com');
  writeUserData();
   loadBar();
   loadBar2();
   loadBar3();
   loadLine();
   loadLine2();
}

  /*
  in this function we simply write a new "table" to firebase,
  it is a simple csv-converted-to-json file in which includes
  the columns or fields of "income" and "total", which is purely
  the results of a 2017 survey covering salary ranges and the 
  amount of household incomes reported for that salary

  we use firebase.database().ref(...) to reference the location
  of our data in which we would like to enter this data

  ive already imported the csv-to-json file in firebase with its
  built-in json importing feauture which is entered to the database

  so i reference "table/income" where name ="income"
  this simple creates an empty location in the database
  for us to enter new data into, however like i said this
  data will be entered to firebase directly as mentioned above
  the console.log("yeet2") is purely for me knowing the request
  was actually met

  look at function getInfo() for next step per se
  */
  function writeUserData() {
    firebase.database().ref('pies/incomeGroups').set({
    x:0
    });
    console.log('yeet2')
  }



  /*
  here we will retrieve our data from the db to read
  arr is simply there for us to create an array of 
  objects we pull from the db, the structure of these
  objects is the data mentioned previously:
    {
        income: 150000
        total: 1234
    }
    arr will house an array of these objects

    incomesRef is simply our own name for a reference
    to the db of the location tables/incomes where the data above
    is housed. I will have to give you the credentials to the db
    so you can manage firebase and look at how it is structured
    ps: it is dumb easy to use as I am showing you here
    incomesRef.on(....) houses our call back function will also 
    includes some kind of "subfunction" you could say, incomeSnapshot
    is simply the "Snapshot" of data we pull from the location
    referenced in the db. However, where we are referencing "table/incomes"
    is housing multiple numbers of these objects shown previously,
    so... we use the subfunction of incomeSnapshot.forEach(...)
    which means that for each object we iterate over in the db location we
    shall do something, our something is simply taking each forEach 
    snapshot and appending/pushing it to our local array
    yay, now this data is available in the front end for display

    this can be done for any structure of object for any location,
    just simply edit the info. 

    Note*:  We will enter the data manually as mentioned in the database,
            we will probs have to do some planning together so we can figure
            out what data we are using and how we will structure it in the db.
            once the data that we need is there, we do not have to change it unless
            needed for the rest of the project... once the data is there, the plan is
            that we will use the javascript library D3.js which is used for data visualization:
            bar graphs, line graphs, maps, all that good shit. and then its on from there 
            easy money

  */
  function getInfo(){
      /*
    arr= new Array()
    
    incomesRef.on('value', function(incomeSnapshot) {
        incomeSnapshot.forEach(function (snapshot) {
            var obj = {
                language: snapshot.val().language,
                value: snapshot.val().value

            }
            arr.push(obj);
            // successful: console.log(obj.income + " has been received.");
            
        })
    })*/

    
  }




  function loadBar(){
    var incomesRef = firebase.database().ref('tables/incomes');
    incomesRef.on('value', snap => {
        var data = [];
        snap.forEach(ss => {
            data.push(ss.val());
        })
        console.log(data)
        const svg = d3.select('#svg1');
      const svgContainer = d3.select('#container');
      
      const margin = 80;
      const width = 1500 - 2 * margin;
      const height = 600 - 2 * margin;
  
      const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);
  
      const xScale = d3.scaleBand()
        .range([0, width])
        .domain(data.map((s) => s.language))
        .padding(0.4)
      
      const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 8000]);
  
      // vertical grid lines
      // const makeXLines = () => d3.axisBottom()
      //   .scale(xScale)
  
      const makeYLines = () => d3.axisLeft()
        .scale(yScale)
  
      chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
  
      chart.append('g')
        .call(d3.axisLeft(yScale));
  
      // vertical grid lines
      // chart.append('g')
      //   .attr('class', 'grid')
      //   .attr('transform', `translate(0, ${height})`)
      //   .call(makeXLines()
      //     .tickSize(-height, 0, 0)
      //     .tickFormat('')
      //   )
  
      chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
          .tickSize(-width, 0, 0)
          .tickFormat('')
        )
  
      const barGroups = chart.selectAll()
        .data(data)
        .enter()
        .append('g')
  
      barGroups
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (g) => xScale(g.language))
        .attr('y', (g) => yScale(g.value))
        .attr('height', (g) => height - yScale(g.value))
        .attr('width', xScale.bandwidth())
        .on('mouseenter', function (actual, i) {
          d3.selectAll('.value')
            .attr('opacity', 0)
  
          d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 0.6)
            .attr('x', (a) => xScale(a.language) - 5)
            .attr('width', xScale.bandwidth() + 10)
  
          const y = yScale(actual.value)
  
          line = chart.append('line')
            .attr('id', 'limit')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)
  
          barGroups.append('text')
            .attr('class', 'divergence')
            .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.value) + 30)
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .text((a, idx) => {
              const divergence = (a.value - actual.value).toFixed(1)
              
              let text = ''
              if (divergence > 0) text += '+'
              text += `${divergence}%`
  
              return idx !== i ? text : '';
            })
  
        })
        .on('mouseleave', function () {
          d3.selectAll('.value')
            .attr('opacity', 1)
  
          d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 1)
            .attr('x', (a) => xScale(a.language))
            .attr('width', xScale.bandwidth())
  
          chart.selectAll('#limit').remove()
          chart.selectAll('.divergence').remove()
        })
  
      barGroups 
        .append('text')
        .attr('class', 'value')
        .attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.value) + 30)
        .attr('text-anchor', 'middle')
        .text((a) => `${a.value}`)
      
      svg
        .append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Total Reported')
  
      svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text('Salaries')
  
      svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Incomes in America, all-inclusive')
  
      svg.append('text')
        .attr('class', 'source')
        .attr('x', width - margin )
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'start')
        .text('Source: US Population Census and Survey, 2017')
    })
      // https://insights.stackoverflow.com/survey/2018/#technology-most-loved-dreaded-and-wanted-languages
    
  
      
    
   
  }

  function loadBar2(){
    var incomesRef = firebase.database().ref('tables/incomesRace');
    incomesRef.on('value', snap => {
        var data = [];
        snap.forEach(ss => {
            data.push(ss.val());
        })
        console.log(data)
        const svg = d3.select('#svg2');
      const svgContainer = d3.select('#container');
      
      const margin = 80;
      const width = 1500 - 2 * margin;
      const height = 600 - 2 * margin;
  
      const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);
  
      const xScale = d3.scaleBand()
        .range([0, width])
        .domain(data.map((s) => s.race))
        .padding(0.4)
      
      const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 85000]);
  
      const makeYLines = () => d3.axisLeft()
        .scale(yScale)
  
      chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
  
      chart.append('g')
        .call(d3.axisLeft(yScale));
  
      chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
          .tickSize(-width, 0, 0)
          .tickFormat('')
        )
  
      const barGroups = chart.selectAll()
        .data(data)
        .enter()
        .append('g')
  
      barGroups
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (g) => xScale(g.race))
        .attr('y', (g) => yScale(g.income))
        .attr('height', (g) => height - yScale(g.income))
        .attr('width', xScale.bandwidth())
        .on('mouseenter', function (actual, i) {
          d3.selectAll('.value')
            .attr('opacity', 0)
  
          d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 0.6)
            .attr('x', (a) => xScale(a.race) - 5)
            .attr('width', xScale.bandwidth() + 10)
  
          const y = yScale(actual.income)
  
          line = chart.append('line')
            .attr('id', 'limit')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)
  
          barGroups.append('text')
            .attr('class', 'divergence')
            .attr('x', (a) => xScale(a.race) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.income) + 30)
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .text((a, idx) => {
              const divergence = (a.income - actual.income).toFixed(1)
              
              let text = ''
              if (divergence > 0) text += '+'
              text += `${divergence/1000}%`
  
              return idx !== i ? text : '';
            })
  
        })
        .on('mouseleave', function () {
          d3.selectAll('.value')
            .attr('opacity', 1)
  
          d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 1)
            .attr('x', (a) => xScale(a.race))
            .attr('width', xScale.bandwidth())
  
          chart.selectAll('#limit').remove()
          chart.selectAll('.divergence').remove()
        })
  
      barGroups 
        .append('text')
        .attr('class', 'value')
        .attr('x', (a) => xScale(a.race) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.income) + 30)
        .attr('text-anchor', 'middle')
        .text((a) => `$${a.income}`)
      
      svg
        .append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Income ($)')
  
      svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text('Races, exclusive')
  
      svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Median Incomes in America by Race, exclusive')
  
      svg.append('text')
        .attr('class', 'source')
        .attr('x', width - margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'start')
        .text('Source: US Population Census and Survey, 2017')
    })
  }

  function loadBar3(){
    var incomesRef = firebase.database().ref('tables/incomesAge');
    incomesRef.on('value', snap => {
        var data = [];
        snap.forEach(ss => {
            data.push(ss.val());
        })
        console.log(data)
        const svg = d3.select('#svg3');
      const svgContainer = d3.select('#container');
      
      const margin = 80;
      const width = 1500 - 2 * margin;
      const height = 600 - 2 * margin;
  
      const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);
  
      const xScale = d3.scaleBand()
        .range([0, width])
        .domain(data.map((s) => s.age))
        .padding(0.4)
      
      const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 85000]);
  
      const makeYLines = () => d3.axisLeft()
        .scale(yScale)
  
      chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
  
      chart.append('g')
        .call(d3.axisLeft(yScale));
  
      chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
          .tickSize(-width, 0, 0)
          .tickFormat('')
        )
  
      const barGroups = chart.selectAll()
        .data(data)
        .enter()
        .append('g')
  
      barGroups
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (g) => xScale(g.age))
        .attr('y', (g) => yScale(g.income))
        .attr('height', (g) => height - yScale(g.income))
        .attr('width', xScale.bandwidth())
        .on('mouseenter', function (actual, i) {
          d3.selectAll('.value')
            .attr('opacity', 0)
  
          d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 0.6)
            .attr('x', (a) => xScale(a.age) - 5)
            .attr('width', xScale.bandwidth() + 10)
  
          const y = yScale(actual.income)
  
          line = chart.append('line')
            .attr('id', 'limit')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)
  
          barGroups.append('text')
            .attr('class', 'divergence')
            .attr('x', (a) => xScale(a.age) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.income) + 30)
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .text((a, idx) => {
              const divergence = (a.income - actual.income).toFixed(1)
              
              let text = ''
              if (divergence > 0) text += '+'
              text += `${divergence/1000}%`
  
              return idx !== i ? text : '';
            })
  
        })
        .on('mouseleave', function () {
          d3.selectAll('.value')
            .attr('opacity', 1)
  
          d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 1)
            .attr('x', (a) => xScale(a.age))
            .attr('width', xScale.bandwidth())
  
          chart.selectAll('#limit').remove()
          chart.selectAll('.divergence').remove()
        })
  
      barGroups 
        .append('text')
        .attr('class', 'value')
        .attr('x', (a) => xScale(a.age) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.income) + 30)
        .attr('text-anchor', 'middle')
        .text((a) => `$${a.income}`)
      
      svg
        .append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Income ($)')
  
      svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .text('Age groups')
  
      svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Median Incomes in America by Age')
  
      svg.append('text')
        .attr('class', 'source')
        .attr('x', width - margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'start')
        .text('Source: US Population Census and Survey, 2017')
    })
  }

  

    


function loadLine(){
  var incomesRef = firebase.database().ref('lines/allIncomes');
  incomesRef.on('value', snap => {
      var data = [];
      snap.forEach(ss => {
          data.push(ss.val());
      })
      console.log(data)
      var margin = {top: 100, right: 150, bottom: 140, left: 50},
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

      var x = d3.scaleLinear().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      var valueline = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.allIncome); });

        var valueline2 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.whiteIncome); });

        var valueline3 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.blackIncome); });

        var valueline4 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.hispanicIncome); });

        var valueline5 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.asainIncome); });

        var svg = d3.select("#svg4").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      x.domain(d3.extent(data, function(d) { return d.year; }));
      y.domain([0, 90000]);

        svg.append("path")
        .data([data])
        .attr('fill','none')
        .attr('stroke','#FF00FF')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("class", "line")
        .attr("d", valueline);

        svg.append("path")
        .data([data])
        .attr('fill','none')
        .attr('stroke','#00FFFF')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("class", "line")
        .attr("d", valueline2);

        svg.append("path")
        .data([data])
        .attr('fill','none')
        .attr('stroke','#00FF00')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("class", "line")
        .attr("d", valueline3);

        svg.append("path")
        .data([data])
        .attr('fill','none')
        .attr('stroke','#FFD700')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("class", "line")
        .attr("d", valueline4);

        svg.append("path")
        .data([data])
        .attr('fill','none')
        .attr('stroke','#ff2400')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("class", "line")
        .attr("d", valueline5);

        svg.append('text')
        .attr('class', 'label')
        .attr('x',50)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(0)')
        .attr('text-anchor', 'middle')
        .text('Income ($)')

        svg.append('text')
        .attr('class', 'label')
        .attr('x',300)
        .attr('y', 405)
        .attr('transform', 'rotate(0)')
        .attr('text-anchor', 'middle')
        .text('Year')

        svg.append('text')
        .attr('class', 'title')
        .attr('x', 300)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .text('Median Incomes in America by Race, exclusive')

        svg.append('text')
        .attr('class', 'label')
        .attr('x',643)
        .attr('y', 120)
        .attr('transform', 'rotate(0)')
        .attr('text-anchor', 'middle')
        .text('$61,372 (All)')

        svg.append('text')
        .attr('class', 'label')
        .attr('x',653)
        .attr('y', 100)
        .attr('transform', 'rotate(0)')
        .attr('text-anchor', 'middle')
        .text('$65,273 (White)')

        svg.append('text')
        .attr('class', 'label')
        .attr('x',653)
        .attr('y', 203)
        .attr('transform', 'rotate(0)')
        .attr('text-anchor', 'middle')
        .text('$40,258 (Black)')

        svg.append('text')
        .attr('class', 'label')
        .attr('x',665)
        .attr('y', 165)
        .attr('transform', 'rotate(0)')
        .attr('text-anchor', 'middle')
        .text('$50,486 (Hispanic)')

        svg.append('text')
        .attr('class', 'label')
        .attr('x',655)
        .attr('y', 40)
        .attr('transform', 'rotate(0)')
        .attr('text-anchor', 'middle')
        .text('$50,486 (Asian)')

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
        // Add the Y Axis
        svg.append("g")
          .call(d3.axisLeft(y));
  });
}

function loadLine2(){
  var incomesRef = firebase.database().ref('lines/incomeSex');
  incomesRef.on('value', snap => {
      var data = [];
      snap.forEach(ss => {
          data.push(ss.val());
      })
      console.log(data)
      var margin = {top: 100, right: 150, bottom: 80, left: 50},
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

      var x = d3.scaleLinear().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      var valueline = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.menIncome); });

        var valueline2 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.womenIncome); });


        var svg = d3.select("#svg5").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      x.domain(d3.extent(data, function(d) { return d.year; }));
      y.domain([0, 90000]);

        svg.append("path")
        .data([data])
        .attr('fill','none')
        .attr('stroke','#00FFFF')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("class", "line")
        .attr("d", valueline);

        svg.append("path")
        .data([data])
        .attr('fill','none')
        .attr('stroke','#FF00FF')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2.5)
        .attr("class", "line")
        .attr("d", valueline2);

        svg.append('text')
        .attr('class', 'label')
        .attr('x',50)
        .attr('y', margin / 2.4)
        .attr('transform', 'rotate(0)')
        .attr('text-anchor', 'middle')
        .text('Income ($)')

        svg.append('text')
        .attr('class', 'label')
        .attr('x',300)
        .attr('y', 485)
        .attr('transform', 'rotate(0)')
        .attr('text-anchor', 'middle')
        .text('Year')


        svg.append('text')
        .attr('class', 'label')
        .attr('x',650)
        .attr('y', 238)
        .attr('transform', 'rotate(0)')
        .attr('text-anchor', 'middle')
        .text('$40,396 (Men)')

        svg.append('text')
        .attr('class', 'label')
        .attr('x',665)
        .attr('y', 305)
        .attr('transform', 'rotate(0)')
        .attr('text-anchor', 'middle')
        .text('$25,486 (Women)')

        svg.append('text')
        .attr('class', 'title')
        .attr('x', 300)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .text('Median Incomes in America by Sex')

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
        // Add the Y Axis
        svg.append("g")
          .call(d3.axisLeft(y));
  });
}

