const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require("../src/math");

test("Should Calc Total With Tip", () => {
    const total = calculateTip(10, 0.30);
    expect(total).toBe(13);
})

test("Should Calc Total W/ Default Tip", () => {
    const total = calculateTip(10);
    expect(total).toBe(12.50);
})


test("Farenheit To Celcius", () => {
    const temp = fahrenheitToCelsius(32);
    expect(temp).toBe(0);
})

test("Celcius To Farenheit", () => {
    const temp = celsiusToFahrenheit(0);
    expect(temp).toBe(32);
})

// test("Async Test Demo", (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2);
//         done();
//     }, 2000)
// })

test("Should Add Two Nums", (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5);
        done();
    })
})

//async functions always return a promise 
test("Should add two nums async/await", async () => {
    const sum = await add(10, 22);
    expect(sum).toBe(32);
})