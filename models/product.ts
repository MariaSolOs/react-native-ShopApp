export class Product {
    constructor(
        readonly id: string,
        readonly ownerId: string,
        readonly ownerPushToken: string,
        readonly title: string,
        readonly imageUrl: string,
        readonly description: string,
        readonly price: number
    ) {}
}