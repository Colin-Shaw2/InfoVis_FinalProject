d3.dsv("\t", "CSCI_3090_Final.tsv").then(function (data) {
  data.forEach(e => {
    e.parents = eval(e.parents);
    e.changes = eval(e.changes);
    e.additions = eval(e.additions);
    e.deletions = eval(e.deletions);
    e.parents = eval(e.parents);
    e.files = eval(e.files);
  });
  findChildren(data);
  console.log(data[0]);
  console.log(data);
  tree = makeTree(data);
  console.log(tree);
  console.log(JSON.stringify(tree));
  // download(JSON.stringify(tree), 'CSCI_3090_Final.json');
  
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
      parent.children = children;
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
    element.treeChildren = treeChildrenList;
  });
  console.log(treeData);
  return treeData;
}

function makeRecursiveTree(inData, index) {
}

