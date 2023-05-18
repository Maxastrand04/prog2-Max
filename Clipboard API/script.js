// Get the copy button element by its ID
const copyButton = document.getElementById("copyButton");
const mydiv = document.getElementById("mydiv")
console.log(copyButton, mydiv)

// Add a click event listener to the button
copyButton.addEventListener("click", function() {
  // Get the text to copy from the button's data attribute
  var textToCopy = copyButton.getAttribute("data-clipboard-text");

  // Use the Clipboard API to copy the text to the clipboard
  navigator.clipboard.writeText(textToCopy);
});
