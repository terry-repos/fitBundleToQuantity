import { parseLinedFile } from '../helpers/utils';
import Product from './product';
import Bundle from './bundle';

interface Item {
    code : string,
    quantity : number,
    price? : number,
    total? : number,
    possibleBundles?: Bundle[]
    bundlesSolution?: BundleSolution[]
    bundlesPicked?: Bundle[] 
}

interface BundleSolution {
    nBundles: number,
    bundleSize: number,
    remainder: number,
    solved?: boolean
}


class Order{
    items: Item[];
    itemCodes : string[];
    bill: string[];

    constructor(){}


    async parseFileToOrder( fileAndPath:string ){
        let parsedOrder:string[] = await parseLinedFile( fileAndPath );
        this.items = this.linesToOrder( parsedOrder );
        this.itemCodes = this.itemCodesInOrder();
    }

    linesToOrder( parsedItems:string[] ): Item[]{
        const items:Item[] = parsedItems.map(itemsLine => {
            const itemArr = itemsLine.split(' ');
            const item:Item = {
                'code' : itemArr[1],
                'quantity' : Number(itemArr[0])
            }
            return item;
        });
        return items;
    }

    itemCodesInOrder():string[]{
        const itemCodes = this.items.map(item => item.code);
        return itemCodes;
    }


    traverseSolutionSpace(solveFor:number, currBundleSize:number, remainingBundles:number[], currSolutionSpace:BundleSolution[]=[]):BundleSolution[]{
        const maxPossibleDividerOfThisBundle = Math.floor(solveFor / currBundleSize);
        // provide possibilities to divide bundles in ways that work at multiple divisors,
        // this may be required for some orders
        // prioritising max num bundles for max discount

        let possibleDividers = Array.from(Array(maxPossibleDividerOfThisBundle).keys()).map(i=>i+1).sort((a,b)=>b-a);
        let bundleSolution:BundleSolution, solved:boolean, divider:number;

        for (var i = 0; i < possibleDividers.length; i++) {
            const solvedInTheInterim = ( currSolutionSpace.length > 0 && ( currSolutionSpace[currSolutionSpace.length - 1].solved ));
            if (solvedInTheInterim) break;
            
            divider = possibleDividers[i];
      
            const remainder = solveFor % currBundleSize;
            solved = (remainder===0);

            bundleSolution = { 
                nBundles: divider,
                bundleSize: currBundleSize,
                remainder,
                solved
            }
            currSolutionSpace.push( bundleSolution );
            if (solved) break;

            if (remainingBundles.length > 0){
                const newBundleSize = remainingBundles[0];
                remainingBundles = remainingBundles.slice(1);
                currSolutionSpace = this.traverseSolutionSpace( remainder, newBundleSize, remainingBundles, currSolutionSpace );
            }
        };
    
        return currSolutionSpace;
    }

    fitBundlesToQuantity(nItemsToFill:number, matchedBundles:Bundle[]):Bundle[]{
        let bestSolution:BundleSolution[]=[];
        let matchedBundleSizes = matchedBundles.map(bundle=>bundle.size);
        let remainingBundles = matchedBundleSizes.slice(1);
        console.log("");
        console.log("solving for ", nItemsToFill);

        matchedBundleSizes.forEach(bundleSize => {
            if (bestSolution.length > 0 && bestSolution[bestSolution.length-1].solved) return;
            bestSolution = this.traverseSolutionSpace(nItemsToFill, bundleSize, remainingBundles);
            remainingBundles = remainingBundles.slice(1);
        });

        console.log("bestSolution: ", bestSolution);
        const bundlesPicked:Bundle[] = bestSolution.map((bundleSolution:BundleSolution) => {
            const price = matchedBundles.find(bundle=>bundle.size===bundleSolution.bundleSize).price;
            return {
                nBundles : bundleSolution.nBundles,
                size : bundleSolution.bundleSize,
                price
            }
        }); 
        return bundlesPicked;
    }



    calcBill(productPricingData:Product[]) {
        this.items = [...this.items].map((item) => {

            const matchedProduct = productPricingData.find(p => p.code === item.code);
            
            item.bundlesPicked = this.fitBundlesToQuantity(item.quantity, matchedProduct.bundles);

            item.total = this.calcItemTotal(item.bundlesPicked);

            return item;
        });
    }

    calcItemTotal(bundlesPicked:Bundle[]):number{
        const subTotals = bundlesPicked.map(bundle=>bundle.nBundles * bundle.price);
        let itemTotal = subTotals.reduce((prevSubTotal, currSubTotal):number => prevSubTotal + currSubTotal);
        itemTotal = Math.round( itemTotal*100 ) / 100;
        return itemTotal;
    }

    printBill(){
        console.log();
        console.log("=========== Bill ===========");
        console.log();
        this.items.forEach((item,i)=>{
            console.log(`(${i+1}) ${item.code} x ${item.quantity} $${item.total.toFixed(2)}`);
            console.log("-------------------");
            item.bundlesPicked.forEach(bundle=>{
                console.log(`${bundle.nBundles} x ${bundle.size} $${bundle.price.toFixed(2)}`);
            });
            console.log();
        });
    }

 
}

export default Order;