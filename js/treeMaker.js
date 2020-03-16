d3.dsv("\t", "CSCI_3090_Final.tsv").then(function (data) {
  data.forEach(e => {
    e.Parents = eval(e.Parents);
    e.changes = eval(e.changes);
    e.additions = eval(e.additions);
    e.deletions = eval(e.deletions);
    e.Parents = eval(e.Parents);
    e.files = eval(e.files);
  });
  findChildren(data);
  console.log(data[0]);
  console.log(data);
  //console.log(JSON.stringify(data));
  makeTree(data);
  console.log(data);
  //get the root look for children
  // var treeData = [
  //     {
  //       "name": "Top Level",
  //       "parent": "null",
  //       "children": [
  //         {
  //           "name": "Level 2: A",
  //           "parent": "Top Level",
  //           "children": [
  //             {
  //               "name": "Son of A",
  //               "parent": "Level 2: A"
  //             },
  //             {
  //               "name": "Daughter of A",
  //               "parent": "Level 2: A"
  //             }
  //           ]
  //         },
  //         {
  //           "name": "Level 2: B",
  //           "parent": "Top Level"
  //         }
  //       ]
  //     }
  //   ];
});



function findChildren(data) {
  //loop through once
  data.forEach(parent => {
    var children = [];
    var childrenIndex = [];
    //loop through every possible child
    data.forEach(function (possibleChild, i) {
      //loop through the list of parents
      possibleChild.Parents.forEach(element => {
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
}

function makeRecursiveTree(inData, index) {
}

