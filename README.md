# fitBundlesToQuantity

Given a customer order determine the cost and bundle breakdown for
each product. To save on shipping space each order should contain the minimal number
of bundles.

## Input:
Each order has a series of lines with each line containing the number of items followed by
the product code

## An example input:
- 10 R12
- 15 L09
- 13 T58
- 
## Output:
A successfully passing test(s) that demonstrates the following output: (The format of the
output is not important)
- 10 R12 $12.99
  - 1 x 10 $12.99

- 15 L09 $41.90
  - 1 x 9 $24.95
  - 1 x 6 $16.95

- 13 T58 $25.85
  - 2 x 5 $9.95
  - 1 x 3 $5.95

## To run
1. git clone https://github.com/terry-repos/fitBundlesToQuantity.git
2. npm install
3. sudo tsc --outDir ./build ./src/index.ts; node ./build/index.js;   
4. Enjoy
