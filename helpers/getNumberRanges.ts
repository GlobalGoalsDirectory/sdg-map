// Source: https://stackoverflow.com/a/2270987
const getNumberRanges = (array: number[]) => {
  const ranges = [];
  let rstart, rend;
  for (let i = 0; i < array.length; i++) {
    rstart = array[i];
    rend = rstart;
    while (array[i + 1] - array[i] == 1) {
      rend = array[i + 1]; // increment the index if the numbers sequential
      i++;
    }
    ranges.push(rstart == rend ? rstart + "" : rstart + "-" + rend);
  }
  return ranges;
};

export default getNumberRanges;
