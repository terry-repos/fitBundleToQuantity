import Product from './product';
import Bundle from './bundle';
import { parseLinedFile } from '../helpers/utils';



class ProductsStore{
    products:Product[];

    constructor(){        

    }

    async parseProductsFileToStore( fileAndPath:string ){
        let parsedProducts:string[] = await parseLinedFile( fileAndPath );
        this.products = this.stringsToProducts( parsedProducts );
    }


    stringsToProducts( parsedProducts:string[] ):Product[]{
        console.log(typeof parsedProducts);
        console.log(parsedProducts);
        const products:Product[] = parsedProducts.map(pp => {
            const ppSplit = pp.split(',');
            const bundles = ppSplit.slice(1).map((b):Bundle => {
                const bSp = (b as string).split(' @ $');
                const bun:Bundle = {
                    size: Number(bSp[0]),
                    price: Number(bSp[1]),
                };
                return bun;
            });
            // Key to sort bundles by size to help quantity-fitting algorithm
            bundles.sort((a,b)=> b.size - a.size);
            return {
                code: ppSplit[0],
                bundles
            };
        });
        return products;
    }

    fetchPricingData( itemCodes: string[] ):Product[]{
        return this.products.filter(product=>itemCodes.includes(product.code));
    }

}

export default ProductsStore;