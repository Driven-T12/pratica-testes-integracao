import { FruitInput } from "services/fruits-service";
import { faker } from "@faker-js/faker"

export function createFruit(name?: string, price?: number) {
    const fruit: FruitInput = {
        name: name || faker.commerce.product(),
        price: price || faker.number.int() 
    }

    return fruit
}