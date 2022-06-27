// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).

// Runs this code if the plugin is run in Figma
if (figma.editorType === "figma") {

  // Skip over invisible nodes and their descendants inside instances for faster performance
  figma.skipInvisibleInstanceChildren = true

//GETS COLOR PALETTE

  // gets all Paint Style from the figma document
  const paintStyles = figma.getLocalPaintStyles();
  // filters in only styles which include '~random' in path name, hence only in ~random folder
  const filteredPaintStyles = paintStyles.filter(style => style.name.includes('~random'));
  // creates palette array of just the style IDs
  const styleIds = filteredPaintStyles.map(style =>
    style.id);

//GETS ALL SELECTED NODES & THEIR CHILDREN

  // create array to store all selected nodes
  const allNodes = []
  // gets all parent notes from current selection
  const parentNodes = figma.currentPage.selection;
  // single out 1 parentNode of current selection
  for (const parentNode of parentNodes) {
    // send it to allNodes array
    allNodes.push(parentNode)
    // check if there are children
    if ("children" in parentNode) {
      // if so, get all children of parentNode
      const childNodes = parentNode.findAll();
      // single out 1 childNode of current selection
      for (const childNode of childNodes) {
        // send it to allNodes array
        allNodes.push(childNode)
      }
    }   
  }

//FILLS WITH RANDOM COLOR FROM PALETTE
 
  // go thru each node in allNodes
  for (const oneNode of allNodes) {
    // check if node has "fills" property
    if ("fills" in oneNode) {
      // gets random styleId from "~random" color palette
      const randomId = styleIds[Math.floor(Math.random() * styleIds.length)];
      // check if styleId property is defined and if so, fill with randomId
      if (randomId != undefined) {
        oneNode.fillStyleId = randomId;
      }
      // if styleId is undefined, shows error message
      else {
        figma.notify('No color styles found with "~random" in name.', {timeout: 5000, error: true});
        break;
      }
    }
  }

  // creates an error if nothing is selected
  if (figma.currentPage.selection.length === 0) {
    figma.notify('Nothing selected.', {timeout: 5000, error: true});
  }
    
// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();

}
