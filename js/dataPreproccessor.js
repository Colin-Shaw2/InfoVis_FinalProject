var fileName ='SushiGo';

d3.dsv("\t", "data/" + fileName + ".tsv").then(function (data) {
  data.forEach(e => {
    e.parents = eval(e.parents);
    e.changes = eval(e.changes);
    e.additions = eval(e.additions);
    e.deletions = eval(e.deletions);
    e.parents = eval(e.parents);
    e.files = eval(e.files);
    e.isMainBranch = (e.branch === "master")?"true":"false";
  });
  findChildren(data);
  tree = makeTree(data);
  sunburst = makeSunburst(data);
  download(JSON.stringify(tree), fileName + 'Tree.json');
  download(JSON.stringify(sunburst), fileName + 'Sunburst.json');
  
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
  var shaUsed = [];
  treeData = data[data.length - 1];
  data.forEach(element => {
    treeChildrenList = []
    element.childrenIndex.forEach(index => {
      if(shaUsed.includes(data[index].sha)){
        //already added
      }else{
      treeChildrenList.push(data[index]);
      shaUsed.push(data[index].sha);
    }
    currentNode = data[index]
      if(currentNode.branch != "master"){
        var currentBranch = currentNode.branch
        console.log(currentNode.branch);
        // console.log(currentNode.parents.length)
        currentNode = data.find(e => e.sha == currentNode.parents[0])
        while(currentNode.branch == "master" && currentNode.parents.length != 0){
          // while(currentNode.parents.length != 0){
          currentNode.branch = currentBranch;
          currentNode.isMainBranch = "false"
          currentNode = data.find(e => e.sha == currentNode.parents[0])
          console.log(currentNode)
        }
      }
    });
    element.children = treeChildrenList;
  });
  console.log(treeData);
  return treeData;
}

function getParents(){

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
        // console.log(e.children);
      }
      // console.log(element.author);
      // console.log(e.author);
    });
  });
  console.log("level 3 ");
  console.log(sunburstData);
  return sunburstData;
}

