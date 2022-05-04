import Order from './models/order';
import ProductsStore from './models/productsStore';

const args:string[] = process.argv.slice(2);

const productsStoreFilePath = './dat/products.table';

var productsStore: ProductsStore;

async function generateBill(orderFilePath:string) {
    productsStore = new ProductsStore()
    await productsStore.parseProductsFileToStore(productsStoreFilePath);

    let order = new Order();
    await order.parseFileToOrder(orderFilePath);

    console.log("order: ", order);

    const productPricingData = await productsStore.fetchPricingData(order.itemCodes);
    console.log("productPricingData: ", productPricingData);

    order.calcBill(productPricingData);
    order.printBill();

    
}

if (require.main === module) {
    let orderFilePath:string = ( args.length > 0 ) ? args[0] : './dat/exampleOrder.txt';
    generateBill(orderFilePath);

}

console.log("args: ", args);