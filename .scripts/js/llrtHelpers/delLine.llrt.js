
export default (numLines) => {
  console.log(`${String.fromCharCode(27)}[${numLines}A`);

  for (let i = 0; i < numLines; i++) {
    console.log(`${String.fromCharCode(27)}[2K`);
  }

  console.log(`${String.fromCharCode(27)}[${numLines + 1}A`);
}
