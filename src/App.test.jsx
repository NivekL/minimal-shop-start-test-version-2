// Important - do this if you don't want to import 
// React in every component
import React from 'react';
globalThis.React = React;

// Import of test-utilities
// (there are more like screen but nut using them here)
// see: https://reactjs.org/docs/test-utils.html
// and https://testing-library.com/docs/queries/about/
import { render, cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

// Make fetch work be mocking it with node-fetch
// (does require that you run the backend whilst running tests)
let f = require('node-fetch');
window.fetch = function (...args) {
  if (args[0].indexOf('/') === 0) {
    args[0] = 'http://localhost:4000' + args[0];
  }
  return f(...args);
}

// A function that let us sleep
// (waiting for fetches, re-renders etc)
let sleep = ms => new Promise(res => setTimeout(res, ms));

// Import App - this means we can test anything in the application
// by the principle: Click on it and check what happens :)
import App from './App';

// This is what you should do in order to "reset" React
// between tests but for some we get an error having do with
// React Easier withContext...
// so right now performing all tests in ONE test block
afterEach(() => {
  cleanup();
});


test('that that adding two items of the first product gives a correct row-sum in the cart', async () => {

  await act(async () => {

    render(<App />);
    await sleep(1000); // wait for fetches

    // Check that the cart is empty initially
    expect(document.querySelector('.cart').innerHTML.includes('The cart is empty')).toBe(true);

    // Check the price of the first product
    let products = document.querySelectorAll('.product');
    let priceOfFirstProduct = products[0].querySelector('.price').innerHTML
    priceOfFirstProduct = +priceOfFirstProduct.split('$')[1].split('<')[0];

    // Simulate two clicks on the more button of the first product
    let moreButtons = document.querySelectorAll('.product .more');
    moreButtons[0].click();
    moreButtons[0].click();
    await sleep(200);

    // Get all products in the cart
    let productsInCart = document.querySelectorAll('.productInCart');
    // Get the row sum of the first product in the cart
    let rowSum = productsInCart[0].querySelector('.rowSum').innerHTML;
    rowSum = +rowSum.split('$')[1];

    // Checking that the cart rowsum is correct
    // toFixed used to make sure we don't run into rounding errors (see 0.1+0.2)
    expect(rowSum.toFixed(2)).toBe((priceOfFirstProduct * 2).toFixed(2));

    // If you should need to change the value of a input field
    // that is controlled by React, you can't use 
    // document.querySelector('input').value, so look into the test module
    // Simulate instead: https://reactjs.org/docs/test-utils.html


    // IF YOU WANT TO CONTINUE CREATING TEST YOU CAN DO SO IN HERE
    // USING JEST EXPECT SYNTAX IN CONJUNCTION WITH
    // READING DATA FROM THE DOM AND CLICKING THINS IN TH DOM

    // https://jestjs.io/docs/expect

    // Create tests according to the list here:
    // https://leverans.lms.nodehill.com/article/projektarbete-beskrivning
    // if you want use this project rather than your own for the "test-part"
    // Create a new repo with this code! And turn that repo in as well
    // when you turn the assignment in in Jensen LearnPoint

  });
});


