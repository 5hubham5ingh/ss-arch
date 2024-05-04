/**
 * Creates a table with the specified number of columns, header values, and data rows.
 *
 * @param {number} numColumns The number of columns in the table.
 * @param {string[]} [headerValues=[]] The values for the header row.
 * @param {string[][]} [dataRows=[]] The values for the data rows.
 * @returns {string} The table as a string.
 */
export default function createTable(numColumns, headerValues = [], dataRows = []) {

  const rows = [];

  const columnMaxLengths = Array(numColumns).fill(0);
  for (const row of [headerValues, ...dataRows]) {
    row.forEach((value, index) => {
      columnMaxLengths[index] = Math.max(columnMaxLengths[index], value.length);
    });
  }
  const lastIndex = columnMaxLengths.length - 1;
  const lastPadding = columnMaxLengths[lastIndex] + 2;

  const headerRow = `┌${columnMaxLengths.map(len => '─'.repeat(len + 2) + '┬').join('').slice(0, -1)}─┐`;

  const headerCells = headerValues.map((value, index) => {
    const currentPadding = index === lastIndex ? columnMaxLengths[index] - value.length + 2 : columnMaxLengths[index] - value.length;
    const pad = Math.ceil(currentPadding / 2);
    const padLeft = pad + value.length;
    const padRight = currentPadding - pad + padLeft;
    const leftPaddedValue = value.padEnd(padLeft, ' ');
    const paddedValue = leftPaddedValue.padStart(padRight, ' ');
    return `│ ${paddedValue}`
  }).join(' ');

  rows.push(`${headerRow}\n${headerCells}│\n├${columnMaxLengths.map(len => '─'.repeat(len + 2) + '┼').join('').slice(0, -1)}─┤`);


  for (const dataRow of dataRows) {
    const cells = dataRow.map((value, index) => `│ ${value.padEnd(index === lastIndex ? lastPadding : columnMaxLengths[index], ' ')}`);
    rows.push(cells.join(' ') + '│');
  }

  const footerRow = `└${columnMaxLengths.map(len => '─'.repeat(len + 2) + '┴').join('').slice(0, -1)}─┘`;
  rows.push(footerRow);

  return rows.join('\n');
}
// const headerValues = ['Name', 'Age', 'City', 'Country', 'Address'];
// const dataRows = [
//   ['Alice', '25', 'New York', 'USA', '123 Main St.'],
//   ['Bob', '30', 'London', 'UK', '456 Elm St.'],
//   ['Charlie', '35', 'Paris', 'France', '789 Oak St.'],
//   ['David', '40', 'Tokyo', 'Japan', '321 Pine St.'],
//   ['Eve', '45', 'Sydney', 'Australia', '654 Cedar St.']
// ];

// const table = createTable(5, headerValues, dataRows);
// console.log(table);
