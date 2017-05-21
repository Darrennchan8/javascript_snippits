if (document.body.getAttribute('contenteditable') === null) {
  document.body.setAttribute('contenteditable', '');
} else {
  document.body.removeAttribute('contenteditable');
}
