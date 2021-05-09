let obj = {row: 4, col: 5};

// let num = {row: 1};

let arr = [
    {row: 4, col: 4, counter: 18},
    {row: 4, col: 5, counter: 18},
    {row: 4, col: 3, counter: 18},
];

let newArr = [...arr];

newArr = newArr.map((obstacle) => ({...obstacle, counter: obstacle.counter - 1}) )
// newArr = newArr.map((obstacle) => {
//     let stuff = {...obstacle, counter: obstacle.counter - 1}
//     console.log(obstacle.coun)
// }
// )
console.log("OUTPUT ÄR ~ file: test.js ~ line 14 ~ newArr", newArr)


// let arr = [
//     {row: 1},
//     {row: 2},
//     {row: 3}
// ];

// let res = arr.includes(obj)
// let res = arr.some((val, index) => val.row === obj.row && val.col === obj.col);
// // let res = arr.some(val => obj);
// console.log("OUTPUT ÄR ~ file: test.js ~ line 9 ~ res", res)

// let other = arr.filter((part, idx) => {
//     console.log(idx);
//     return (part.row === obj.row && part.col === obj.col)
//     }
// );
// console.log("OUTPUT ÄR ~ file: test.js ~ line 24 ~ other ~ other", other)

// a = [
//     {prop1:"abc",prop2:"qwe"},
//     {prop1:"bnmb",prop2:"yutu"},
//     {prop1:"zxvz",prop2:"qwrq"}];
      
//   index = a.findIndex(x => x.prop2 ==="yutu");
  
//   console.log("index ärrrr ", index);
