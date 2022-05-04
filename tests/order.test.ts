import 'jest';
import Order from '../src/models/order';

const orderSampleFilePath = './dat/exampleOrder.txt';

const productPricingData = [{
    code: 'R12',
    bundles: [{ size: 10, price: 12.99 },
        { size: 5, price: 6.99 }],
    },
    {
        code: 'L09',
        bundles: [{ size: 9, price: 24.95 },
            { size: 6, price: 16.95 },
            { size: 3, price: 9.95 }],
    },
    {
        code: 'T58',
        bundles: [{ size: 9, price: 16.99 },
            { size: 5, price: 9.95 },
            { size: 3, price: 5.95 }],
    }
];

const billTotals = [ 12.99, 41.9, 25.85 ];


describe('Order', () => {
    let order: Order;

    beforeEach(async () => {
        order = new Order();
        await order.parseFileToOrder(orderSampleFilePath);
    });

    it('should populate the orders', () => {
        expect(order).toBeInstanceOf(Order);
    
        expect(order.items.length).toBe(3);
    });

    it('should calculate a correct bill', () => {
        order.calcBill(productPricingData);
        const totals = order.items.map(item=>item.total);

        expect(totals).toEqual(billTotals);
    });


    it('should be able to call printBill without error', () => {
        order.calcBill(productPricingData);
        order.printBill();
    });

});