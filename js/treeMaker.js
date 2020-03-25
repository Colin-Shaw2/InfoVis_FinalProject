d3.dsv("\t", "SushiGoMk1.tsv").then(function (data) {
  data.forEach(e => {
    e.parents = eval(e.parents);
    e.changes = eval(e.changes);
    e.additions = eval(e.additions);
    e.deletions = eval(e.deletions);
    e.parents = eval(e.parents);
    e.files = eval(e.files);
    e.isMainBranch = (e.branch === "master")?true:false;
  });
  findChildren(data);
  // console.log(data[0]);
  // console.log(data);
  tree = makeTree(data);
  // console.log(tree);
  // console.log(JSON.stringify(tree));
  sunburst = makeSunburst(data);
  // console.log(JSON.stringify(sunburst));
  download(JSON.stringify(sunburst), 'SushiGoBranches.json');
  // download(JSON.stringify(tree), 'CSCI_3090_Final.json');
  // download(JSON.stringify(sunburst), 'SQA_Project_Sunburst.json');
  // download(JSON.stringify(sunburst), 'SushiGo.json');
  // download(JSON.stringify(sunburst), 'Sunburst_Test.json');
  
});

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function findChildren(data) {
  //loop through once
  data.forEach(parent => {
    var children = [];
    var childrenIndex = [];
    //loop through every possible child
    data.forEach(function (possibleChild, i) {
      //loop through the list of parents
      possibleChild.parents.forEach(element => {
        if (parent.sha === element) {
          children.push(possibleChild.sha);
          childrenIndex.push(i);
        }
      });
      parent.childrenSha = children;
      parent.childrenIndex = childrenIndex;
    });
  });
}

function makeTree(data) {
  treeData = data[data.length - 1];
  data.forEach(element => {
    treeChildrenList = []
    element.childrenIndex.forEach(index => {
      treeChildrenList.push(data[index]);
    });
    element.children = treeChildrenList;
  });
  console.log(treeData);
  return treeData;
}

function makeSunburst(inData) {
  authors = new Set();
  //make the top level
  sunburstData = {name: "RepoName", children: [] };
  console.log("level 1 ");
  console.log(sunburstData);
  //get all the authors
  inData.forEach(element => {
    authors.add(element.author);
  });
  //make second level the authors
  authors.forEach(element => {
    sunburstData.children.push({author: element, children : []});
  });
  
  console.log("level 2 ");
  console.log( sunburstData);
  inData.forEach(element => {
    // console.log(element.author);
    // console.log(sunburstData.children[element.author]);
    sunburstData.children.forEach(e => {
      if(e.author === element.author){
        e.children.push(element);
        console.log(e.children);
      }
      // console.log(element.author);
      // console.log(e.author);
    });
  });
  console.log("level 3 ");
  console.log(sunburstData);
  return sunburstData;
}

